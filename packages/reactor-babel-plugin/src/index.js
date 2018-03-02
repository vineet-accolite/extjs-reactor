var reactVersion = 0; 
import fs from 'fs';
import path from 'path';
const OLD_MODULE_PATTERN = /^@extjs\/reactor\/modern$/;
const MODULE_PATTERN = /^@extjs\/(ext-react.*|reactor\/classic)$/;
module.exports = function(babel) {
	var pkg = (fs.existsSync('package.json') && JSON.parse(fs.readFileSync('package.json', 'utf-8')) || {});
	var reactEntry = pkg.dependencies.react
	var is16 = reactEntry.includes("16");
	if (is16) { reactVersion = 16 }
	else { reactVersion = 15 }
	console.log('\nreactor-babel-plugin reactVersion: ' + reactVersion)
	const t = babel.types;

    return {
        visitor: {
            ImportDeclaration: function(path) {
                const { node } = path;
                if (node.source && node.source.type === 'StringLiteral' && (node.source.value.match(MODULE_PATTERN) || node.source.value.match(OLD_MODULE_PATTERN))) {
//debugger
//console.log(path.hub.file.opts.filename)
//console.log(path.hub.file.code)
									const declarations = [];
                    let transform = false;

                    node.specifiers.forEach(spec => {
                        const imported = spec.imported.name;
                        const local = spec.local.name;
//												console.log(imported)
//												console.log(local)
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
//												console.log('s')
//												console.log(declarations)
//												console.log('e')

                        path.replaceWithMultiple(declarations);
                    }
                }
            }
        }
    }
}

//https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md