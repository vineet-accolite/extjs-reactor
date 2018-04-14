var chalk = require('chalk')

//a comment
import validateOptions from 'schema-utils';
import uniq from 'lodash.uniq';
import isGlob from 'is-glob';
import glob from 'glob';
import fs from 'fs';
import { resolve } from 'path';
var readline = require('readline');

//const app = '\nℹ ｢ext｣: ExtJSWebpackPlugin: '
const app = `${chalk.green('ℹ ｢ext｣:')} ExtJSWebpackPlugin: `;


function getFileAndContextDeps(compilation, files, dirs, cwd) {
  const { fileDependencies, contextDependencies } = compilation;
  const isWebpack4 = compilation.hooks;
  let fds = isWebpack4 ? [...fileDependencies] : fileDependencies;
  let cds = isWebpack4 ? [...contextDependencies] : contextDependencies;
  if (files.length > 0) {
    files.forEach((pattern) => {
      let f = pattern;
      if (isGlob(pattern)) {
        f = glob.sync(pattern, {
          cwd,
          dot: true,
          absolute: true,
        });
      }
      fds = fds.concat(f);
    });
    fds = uniq(fds);
  }
  if (dirs.length > 0) {
    cds = uniq(cds.concat(dirs));
  }
  return {
    fileDependencies: fds,
    contextDependencies: cds,
  };
}

function hook_stdout(callback) {
  var old_write = process.stdout.write
  console.log('in hook')
  process.stdout.write = (function(write) {
      return function(string, encoding, fd) {
          write.apply(process.stdout, arguments)
          callback(string, encoding, fd)
      }
  })(process.stdout.write)

  return function() {
      process.stdout.write = old_write
      console.log('in unhook')
    }
}




export default class ExtraWatchWebpackPlugin {
  static defaults = {
    cwd: process.cwd(),
    files: [],
    dirs: [],
  };

  constructor(options = {}) {
    // this.unhook = hook_stdout(function(string, encoding, fd) {
    //   console.log('stdout: ' + string)
    // })
    process.stdout.cursorTo(0)
    console.log(app + 'constructor')
    validateOptions(require('../options.json'), options, 'ExtraWatchWebpackPlugin'); // eslint-disable-line
    this.options = { ...ExtraWatchWebpackPlugin.defaults, ...options };
  }

  apply(compiler) {
    let { files, dirs } = this.options;
    const { cwd } = this.options;
    files = typeof files === 'string' ? [files] : files;
    dirs = typeof dirs === 'string' ? [dirs] : dirs;

    if (compiler.hooks) {
      compiler.hooks.afterCompile.tap('extjs-after-compile', (compilation) => {
//        console.log(readline)
        process.stdout.cursorTo(0)
        console.log(app + 'extjs-after-compile')
        const {
          fileDependencies,
          contextDependencies,
        } = getFileAndContextDeps(compilation, files, dirs, cwd);
        if (files.length > 0) {
          fileDependencies.forEach((file) => {
            compilation.fileDependencies.add(resolve(file));
          });
        }
        if (dirs.length > 0) {
          contextDependencies.forEach((context) => {
            compilation.contextDependencies.add(context);
          });
        }
      });
    } else {
      compiler.plugin('after-compile', (compilation, cb) => {
        console.log(app + 'after-compile')
        const {
          fileDependencies,
          contextDependencies,
        } = getFileAndContextDeps(compilation, files, dirs, cwd);
        if (files.length > 0) {
          compilation.fileDependencies = fileDependencies; // eslint-disable-line
        }
        if (dirs.length > 0) {
          compilation.contextDependencies = contextDependencies; // eslint-disable-line
        }
        cb()
      });
    }

    if (compiler.hooks) {
      compiler.hooks.emit.tap('extjs-emit', (compilation) => {
        process.stdout.cursorTo(0)
        console.log(app + 'extjs-emit')

        var recursiveReadSync = require('recursive-readdir-sync')
        var files
       
        try {
          files = recursiveReadSync('./app');
        } catch(err){
          if(err.errno === 34){
            console.log('Path does not exist');
          } else {
            //something unrelated went wrong, rethrow 
            throw err;
          }
        }

        var currentNumFiles = files.length
 
        var filesource = 'this file enables client reload'
        compilation.assets[currentNumFiles + 'FilesForReload.md'] = {
          source: function() {return filesource},
          size: function() {return filesource.length}
        }

        if (currentNumFiles != this.lastNumFiles) {
          //var build = require('@extjs/sencha-builder/app/build.js')
          //new build({})
          var refresh = require('@extjs/sencha-builder/app/refresh.js')
          //var refresh = require('@extjs/sencha-builder/refresh')
          new refresh({})
        }
        else {
          console.log(app + 'Call to Sencha Builder not needed, no new files')
        }
        this.lastNumFiles = currentNumFiles
//        this.unhook()
      })
    }
    else {
      compiler.plugin('emit', (compilation, cb) => {
        console.log(app + 'emit')
        var filelist = 'this file enables client reload'
        compilation.assets['ForReload.md'] = {
          source: function() {return filelist},
          size: function() {return filelist.length}
        }
        var refresh = require('@extjs/sencha-node/app/refresh.js')
        new refresh({})
        cb()
      })
    }

  }
}



        // var filelist = 'In this build:\n\n';

        // // Loop through all compiled assets,
        // // adding a new line item for each filename.
        // for (var filename in compilation.assets) {
        //   filelist += ('- '+ filename +'\n');
        // }
    
        // // Insert this list into the webpack build as a new file asset:
        // compilation.assets['filelist.md'] = {
        //   source: function() {
        //     return filelist;
        //   },
        //   size: function() {
        //     return filelist.length;
        //   }
        // };





        // //var d = new Date()
        // var d = 'mjg'
        // var filelist = 'In this build:\n\n' + d + '\n\n';
        // // Loop through all compiled assets,
        // // adding a new line item for each filename.
        // for (var filename in compilation.assets) {
        //   filelist += ('- '+ filename +'\n');
        // }
        // // Insert this list into the webpack build as a new file asset:
        // compilation.assets[d + '.md'] = {
        //   source: function() {
        //     return filelist;
        //   },
        //   size: function() {
        //     return filelist.length;
        //   }
        // };