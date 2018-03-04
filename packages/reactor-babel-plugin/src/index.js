var reactVersion = 0; 
import fs from 'fs';
import path from 'path';
const MODULE_PATTERN_GENERIC = /^@extjs\/reactor$/;
const OLD_MODULE_PATTERN = /^@extjs\/reactor\/modern$/;
const MODULE_PATTERN = /^@extjs\/(ext-react.*|reactor\/classic)$/;
module.exports = function(babel) {
  var pkg = (fs.existsSync('package.json') && JSON.parse(fs.readFileSync('package.json', 'utf-8')) || {});
  var reactEntry = pkg.dependencies.react
  var is16 = reactEntry.includes("16");
  if (is16) { reactVersion = 16 } else { reactVersion = 15 }
  console.log('\nreactor-babel-plugin reactVersion: ' + reactVersion)
  const t = babel.types;

  return {
    visitor: {
      ImportDeclaration: function(path) {
        const { node } = path;

        /*
        //added mjg
        //make sure we cover all cases here
        changes 
        import { launch } from '@extjs/reactor';
        to 
        { launch } from '@extjs/reactor16';
        */
        if (node.source && node.source.type === 'StringLiteral' 
        && node.source.value.match(MODULE_PATTERN_GENERIC)) {
          const local = node.specifiers[0].local.name;
          //do we need this if??  are we handling multiple defines?
          if(local === 'launch' 
          || local === 'reactify'
          || local === 'Template') {
            path.replaceWith(
              t.importDeclaration(
                [t.importSpecifier(t.identifier(local), t.identifier(local))],
                t.stringLiteral(`@extjs/reactor${reactVersion}`)
              )
            );
          }
        }
        //added mjg

        if (node.source && node.source.type === 'StringLiteral' 
        && (node.source.value.match(MODULE_PATTERN) 
        || node.source.value.match(OLD_MODULE_PATTERN))) {
          //console.log('\n@@@'+path.hub.file.opts.filename)
          //console.log(path.hub.file.code)
          const declarations = [];
          let transform = false;

          node.specifiers.forEach(spec => {
            const imported = spec.imported.name;
            const local = spec.local.name;
            declarations.push(
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier(local),
                  t.callExpression(
                    t.identifier('reactify'),
                    [t.stringLiteral(imported)]
                  )
                )
              ])
            );
          });

          if (declarations.length) {
            if (!path.scope.hasBinding('reactify')) {
              path.insertBefore(
                t.importDeclaration(
                  [t.importSpecifier(t.identifier('reactify'), t.identifier('reactify'))],
                  t.stringLiteral(`@extjs/reactor${reactVersion}`)
                )
              )
            }
            path.replaceWithMultiple(declarations);
          }
        }
      }
    }
  }
}

//https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md