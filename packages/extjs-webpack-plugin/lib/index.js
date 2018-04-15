'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _schemaUtils = require('schema-utils');

var _schemaUtils2 = _interopRequireDefault(_schemaUtils);

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _isGlob = require('is-glob');

var _isGlob2 = _interopRequireDefault(_isGlob);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _recursiveReaddirSync = require('recursive-readdir-sync');

var _recursiveReaddirSync2 = _interopRequireDefault(_recursiveReaddirSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//const recursiveReadSync = require('recursive-readdir-sync')

var app = _chalk2.default.green('ℹ ｢ext｣:') + ' extjs-webpack-plugin: ';

function getFileAndContextDeps(compilation, files, dirs, cwd) {
  var fileDependencies = compilation.fileDependencies,
      contextDependencies = compilation.contextDependencies;

  var isWebpack4 = compilation.hooks;
  var fds = isWebpack4 ? [].concat(_toConsumableArray(fileDependencies)) : fileDependencies;
  var cds = isWebpack4 ? [].concat(_toConsumableArray(contextDependencies)) : contextDependencies;
  if (dirs.length > 0) {
    cds = (0, _lodash2.default)(cds.concat(dirs));
  }
  return {
    fileDependencies: fds,
    contextDependencies: cds
  };
}

var ExtJSWebpackPlugin = function () {
  function ExtJSWebpackPlugin() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ExtJSWebpackPlugin);

    (0, _schemaUtils2.default)(require('../options.json'), options, 'ExtraWatchWebpackPlugin'); // eslint-disable-line
    this.options = _extends({}, ExtJSWebpackPlugin.defaults, options);
  }

  _createClass(ExtJSWebpackPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      if (this.webpackVersion == undefined) {
        var isWebpack4 = compiler.hooks;
        if (isWebpack4) {
          this.webpackVersion = 'IS webpack 4';
        } else {
          this.webpackVersion = 'NOT webpack 4';
        }
        this.extjsVersion = '6.5.3';
        process.stdout.cursorTo(0);console.log(app + 'Ext JS v' + this.extjsVersion + ', ' + this.webpackVersion);
      }

      var _options = this.options,
          files = _options.files,
          dirs = _options.dirs;
      var cwd = this.options.cwd;

      files = typeof files === 'string' ? [files] : files;
      dirs = typeof dirs === 'string' ? [dirs] : dirs;

      if (compiler.hooks) {
        compiler.hooks.afterCompile.tap('extjs-after-compile', function (compilation) {
          process.stdout.cursorTo(0);console.log(app + 'extjs-after-compile');

          var _getFileAndContextDep = getFileAndContextDeps(compilation, files, dirs, cwd),
              fileDependencies = _getFileAndContextDep.fileDependencies,
              contextDependencies = _getFileAndContextDep.contextDependencies;

          if (files.length > 0) {
            fileDependencies.forEach(function (file) {
              compilation.fileDependencies.add((0, _path.resolve)(file));
            });
          }
          if (dirs.length > 0) {
            contextDependencies.forEach(function (context) {
              compilation.contextDependencies.add(context);
            });
          }
        });
      } else {
        compiler.plugin('after-compile', function (compilation, cb) {
          console.log(app + 'after-compile');

          var _getFileAndContextDep2 = getFileAndContextDeps(compilation, files, dirs, cwd),
              fileDependencies = _getFileAndContextDep2.fileDependencies,
              contextDependencies = _getFileAndContextDep2.contextDependencies;

          if (files.length > 0) {
            compilation.fileDependencies = fileDependencies; // eslint-disable-line
          }
          if (dirs.length > 0) {
            compilation.contextDependencies = contextDependencies; // eslint-disable-line
          }
          cb();
        });
      }

      if (compiler.hooks) {
        compiler.hooks.emit.tap('extjs-emit', function (compilation) {
          process.stdout.cursorTo(0);console.log(app + 'extjs-emit');

          var watchedFiles = [];
          try {
            watchedFiles = (0, _recursiveReaddirSync2.default)('./app');
          } catch (err) {
            if (err.errno === 34) {
              console.log('Path does not exist');
            } else {
              throw err;
            }
          }

          var doBuild = false;
          for (var file in watchedFiles) {
            if (_this.lastMilliseconds < _fs2.default.statSync(watchedFiles[file]).mtimeMs) {
              if (watchedFiles[file].indexOf("scss") != -1) {
                doBuild = true;break;
              }
            }
          }
          _this.lastMilliseconds = new Date().getTime();

          var currentNumFiles = watchedFiles.length;
          var filesource = 'this file enables client reload';
          compilation.assets[currentNumFiles + 'FilesUnderAppFolder.md'] = {
            source: function source() {
              return filesource;
            },
            size: function size() {
              return filesource.length;
            }
          };

          if (currentNumFiles != _this.lastNumFiles || doBuild) {
            var build = require('@extjs/sencha-build/app/build.js');
            new build({});
            //var refresh = require('@extjs/sencha-build/app/refresh.js')
            //new refresh({})
          } else {
            console.log(app + 'Call to Sencha Build not needed, no new files');
          }
          _this.lastNumFiles = currentNumFiles;
        });
      } else {
        compiler.plugin('emit', function (compilation, cb) {
          console.log(app + 'emit');
          var filelist = 'this file enables client reload';
          compilation.assets['ForReload.md'] = {
            source: function source() {
              return filelist;
            },
            size: function size() {
              return filelist.length;
            }
          };
          var refresh = require('@extjs/sencha-node/app/refresh.js');
          new refresh({});
          cb();
        });
      }
    }
  }]);

  return ExtJSWebpackPlugin;
}();

// if (files.length > 0) {
//   files.forEach((pattern) => {
//     let f = pattern;
//     if (isGlob(pattern)) {
//       f = glob.sync(pattern, {
//         cwd,
//         dot: true,
//         absolute: true,
//       });
//     }
//     fds = fds.concat(f);
//   });
//   fds = uniq(fds);
// }


// function hook_stdout(callback) {
//   var old_write = process.stdout.write
//   console.log('in hook')
//   process.stdout.write = (function(write) {
//       return function(string, encoding, fd) {
//           write.apply(process.stdout, arguments)
//           callback(string, encoding, fd)
//       }
//   })(process.stdout.write)

//   return function() {
//       process.stdout.write = old_write
//       console.log('in unhook')
//     }
// }
// this.unhook = hook_stdout(function(string, encoding, fd) {
//   console.log('stdout: ' + string)
// })

//        this.unhook()


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


ExtJSWebpackPlugin.defaults = {
  cwd: process.cwd(),
  files: [],
  dirs: ['./app']
};
exports.default = ExtJSWebpackPlugin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJncmVlbiIsImdldEZpbGVBbmRDb250ZXh0RGVwcyIsImNvbXBpbGF0aW9uIiwiZmlsZXMiLCJkaXJzIiwiY3dkIiwiZmlsZURlcGVuZGVuY2llcyIsImNvbnRleHREZXBlbmRlbmNpZXMiLCJpc1dlYnBhY2s0IiwiaG9va3MiLCJmZHMiLCJjZHMiLCJsZW5ndGgiLCJjb25jYXQiLCJFeHRKU1dlYnBhY2tQbHVnaW4iLCJvcHRpb25zIiwicmVxdWlyZSIsImRlZmF1bHRzIiwiY29tcGlsZXIiLCJ3ZWJwYWNrVmVyc2lvbiIsInVuZGVmaW5lZCIsImV4dGpzVmVyc2lvbiIsInByb2Nlc3MiLCJzdGRvdXQiLCJjdXJzb3JUbyIsImNvbnNvbGUiLCJsb2ciLCJhZnRlckNvbXBpbGUiLCJ0YXAiLCJmb3JFYWNoIiwiZmlsZSIsImFkZCIsImNvbnRleHQiLCJwbHVnaW4iLCJjYiIsImVtaXQiLCJ3YXRjaGVkRmlsZXMiLCJlcnIiLCJlcnJubyIsImRvQnVpbGQiLCJsYXN0TWlsbGlzZWNvbmRzIiwic3RhdFN5bmMiLCJtdGltZU1zIiwiaW5kZXhPZiIsIkRhdGUiLCJnZXRUaW1lIiwiY3VycmVudE51bUZpbGVzIiwiZmlsZXNvdXJjZSIsImFzc2V0cyIsInNvdXJjZSIsInNpemUiLCJsYXN0TnVtRmlsZXMiLCJidWlsZCIsImZpbGVsaXN0IiwicmVmcmVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBQ0E7O0FBRUEsSUFBTUEsTUFBUyxnQkFBTUMsS0FBTixDQUFZLFVBQVosQ0FBVCw0QkFBTjs7QUFFQSxTQUFTQyxxQkFBVCxDQUErQkMsV0FBL0IsRUFBNENDLEtBQTVDLEVBQW1EQyxJQUFuRCxFQUF5REMsR0FBekQsRUFBOEQ7QUFBQSxNQUNwREMsZ0JBRG9ELEdBQ1ZKLFdB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QVEsa0JBQVc7QUFBQyxxQkFBT0ksUUFBUDtBQUFnQixhQUREO0FBRW5DSCxrQkFBTSxnQkFBVztBQUFDLHFCQUFPRyxTQUFTekMsTUFBaEI7QUFBdUI7QUFGTixXQUFyQztBQUlBLGNBQUkwQyxVQUFVdEMsUUFBUSxtQ0FBUixDQUFkO0FBQ0EsY0FBSXNDLE9BQUosQ0FBWSxFQUFaO0FBQ0FwQjtBQUNELFNBVkQ7QUFXRDtBQUVGOzs7Ozs7QUFLRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTs7QUFFSjs7O0FBTVE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQXBNYXBCLGtCLENBQ1pHLFEsR0FBVztBQUNoQlosT0FBS2lCLFFBQVFqQixHQUFSLEVBRFc7QUFFaEJGLFNBQU8sRUFGUztBQUdoQkMsUUFBTSxDQUFDLE9BQUQ7QUFIVSxDO2tCQURDVSxrQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHZhbGlkYXRlT3B0aW9ucyBmcm9tICdzY2hlbWEtdXRpbHMnO1xuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IGlzR2xvYiBmcm9tICdpcy1nbG9iJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlY3Vyc2l2ZVJlYWRTeW5jIGZyb20gJ3JlY3Vyc2l2ZS1yZWFkZGlyLXN5bmMnO1xuLy9jb25zdCByZWN1cnNpdmVSZWFkU3luYyA9IHJlcXVpcmUoJ3JlY3Vyc2l2ZS1yZWFkZGlyLXN5bmMnKVxuXG5jb25zdCBhcHAgPSBgJHtjaGFsay5ncmVlbign4oS5IO+9omV4dO+9ozonKX0gZXh0anMtd2VicGFjay1wbHVnaW46IGA7XG5cbmZ1bmN0aW9uIGdldEZpbGVBbmRDb250ZXh0RGVwcyhjb21waWxhdGlvbiwgZmlsZXMsIGRpcnMsIGN3ZCkge1xuICBjb25zdCB7IGZpbGVEZXBlbmRlbmNpZXMsIGNvbnRleHREZXBlbmRlbmNpZXMgfSA9IGNvbXBpbGF0aW9uO1xuICBjb25zdCBpc1dlYnBhY2s0ID0gY29tcGlsYXRpb24uaG9va3M7XG4gIGxldCBmZHMgPSBpc1dlYnBhY2s0ID8gWy4uLmZpbGVEZXBlbmRlbmNpZXNdIDogZmlsZURlcGVuZGVuY2llcztcbiAgbGV0IGNkcyA9IGlzV2VicGFjazQgPyBbLi4uY29udGV4dERlcGVuZGVuY2llc10gOiBjb250ZXh0RGVwZW5kZW5jaWVzO1xuICBpZiAoZGlycy5sZW5ndGggPiAwKSB7XG4gICAgY2RzID0gdW5pcShjZHMuY29uY2F0KGRpcnMpKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGZpbGVEZXBlbmRlbmNpZXM6IGZkcyxcbiAgICBjb250ZXh0RGVwZW5kZW5jaWVzOiBjZHMsXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4dEpTV2VicGFja1BsdWdpbiB7XG4gIHN0YXRpYyBkZWZhdWx0cyA9IHtcbiAgICBjd2Q6IHByb2Nlc3MuY3dkKCksXG4gICAgZmlsZXM6IFtdLFxuICAgIGRpcnM6IFsnLi9hcHAnXSxcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB2YWxpZGF0ZU9wdGlvbnMocmVxdWlyZSgnLi4vb3B0aW9ucy5qc29uJyksIG9wdGlvbnMsICdFeHRyYVdhdGNoV2VicGFja1BsdWdpbicpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgdGhpcy5vcHRpb25zID0geyAuLi5FeHRKU1dlYnBhY2tQbHVnaW4uZGVmYXVsdHMsIC4uLm9wdGlvbnMgfTtcbiAgfVxuXG4gIGFwcGx5KGNvbXBpbGVyKSB7XG5cbiAgICBpZiAodGhpcy53ZWJwYWNrVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGlzV2VicGFjazQgPSBjb21waWxlci5ob29rcztcbiAgICAgIGlmIChpc1dlYnBhY2s0KSB7dGhpcy53ZWJwYWNrVmVyc2lvbiA9ICdJUyB3ZWJwYWNrIDQnfVxuICAgICAgZWxzZSB7dGhpcy53ZWJwYWNrVmVyc2lvbiA9ICdOT1Qgd2VicGFjayA0J31cbiAgICAgIHRoaXMuZXh0anNWZXJzaW9uID0gJzYuNS4zJ1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY3Vyc29yVG8oMCk7Y29uc29sZS5sb2coYXBwICsgJ0V4dCBKUyB2JyArIHRoaXMuZXh0anNWZXJzaW9uICsgJywgJyArIHRoaXMud2VicGFja1ZlcnNpb24pXG4gICAgfVxuXG4gICAgbGV0IHsgZmlsZXMsIGRpcnMgfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCB7IGN3ZCB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGZpbGVzID0gdHlwZW9mIGZpbGVzID09PSAnc3RyaW5nJyA/IFtmaWxlc10gOiBmaWxlcztcbiAgICBkaXJzID0gdHlwZW9mIGRpcnMgPT09ICdzdHJpbmcnID8gW2RpcnNdIDogZGlycztcblxuICAgIGlmIChjb21waWxlci5ob29rcykge1xuICAgICAgY29tcGlsZXIuaG9va3MuYWZ0ZXJDb21waWxlLnRhcCgnZXh0anMtYWZ0ZXItY29tcGlsZScsIChjb21waWxhdGlvbikgPT4ge1xuICAgICAgICBwcm9jZXNzLnN0ZG91dC5jdXJzb3JUbygwKTtjb25zb2xlLmxvZyhhcHAgKyAnZXh0anMtYWZ0ZXItY29tcGlsZScpXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBmaWxlRGVwZW5kZW5jaWVzLFxuICAgICAgICAgIGNvbnRleHREZXBlbmRlbmNpZXMsXG4gICAgICAgIH0gPSBnZXRGaWxlQW5kQ29udGV4dERlcHMoY29tcGlsYXRpb24sIGZpbGVzLCBkaXJzLCBjd2QpO1xuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpbGVEZXBlbmRlbmNpZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICAgICAgY29tcGlsYXRpb24uZmlsZURlcGVuZGVuY2llcy5hZGQocmVzb2x2ZShmaWxlKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnRleHREZXBlbmRlbmNpZXMuZm9yRWFjaCgoY29udGV4dCkgPT4ge1xuICAgICAgICAgICAgY29tcGlsYXRpb24uY29udGV4dERlcGVuZGVuY2llcy5hZGQoY29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21waWxlci5wbHVnaW4oJ2FmdGVyLWNvbXBpbGUnLCAoY29tcGlsYXRpb24sIGNiKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFwcCArICdhZnRlci1jb21waWxlJylcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGZpbGVEZXBlbmRlbmNpZXMsXG4gICAgICAgICAgY29udGV4dERlcGVuZGVuY2llcyxcbiAgICAgICAgfSA9IGdldEZpbGVBbmRDb250ZXh0RGVwcyhjb21waWxhdGlvbiwgZmlsZXMsIGRpcnMsIGN3ZCk7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29tcGlsYXRpb24uZmlsZURlcGVuZGVuY2llcyA9IGZpbGVEZXBlbmRlbmNpZXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29tcGlsYXRpb24uY29udGV4dERlcGVuZGVuY2llcyA9IGNvbnRleHREZXBlbmRlbmNpZXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfVxuICAgICAgICBjYigpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY29tcGlsZXIuaG9va3MpIHtcbiAgICAgIGNvbXBpbGVyLmhvb2tzLmVtaXQudGFwKCdleHRqcy1lbWl0JywgKGNvbXBpbGF0aW9uKSA9PiB7XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LmN1cnNvclRvKDApO2NvbnNvbGUubG9nKGFwcCArICdleHRqcy1lbWl0JylcblxuICAgICAgICB2YXIgd2F0Y2hlZEZpbGVzPVtdXG4gICAgICAgIHRyeSB7d2F0Y2hlZEZpbGVzID0gcmVjdXJzaXZlUmVhZFN5bmMoJy4vYXBwJyl9IFxuICAgICAgICBjYXRjaChlcnIpIHtpZihlcnIuZXJybm8gPT09IDM0KXtjb25zb2xlLmxvZygnUGF0aCBkb2VzIG5vdCBleGlzdCcpO30gZWxzZSB7dGhyb3cgZXJyO319XG5cbiAgICAgICAgdmFyIGRvQnVpbGQgPSBmYWxzZVxuICAgICAgICBmb3IgKHZhciBmaWxlIGluIHdhdGNoZWRGaWxlcykge1xuICAgICAgICAgIGlmICh0aGlzLmxhc3RNaWxsaXNlY29uZHMgPCBmcy5zdGF0U3luYyh3YXRjaGVkRmlsZXNbZmlsZV0pLm10aW1lTXMpIHtcbiAgICAgICAgICAgIGlmICh3YXRjaGVkRmlsZXNbZmlsZV0uaW5kZXhPZihcInNjc3NcIikgIT0gLTEpIHtkb0J1aWxkPXRydWU7YnJlYWs7fVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhc3RNaWxsaXNlY29uZHMgPSAobmV3IERhdGUpLmdldFRpbWUoKVxuXG4gICAgICAgIHZhciBjdXJyZW50TnVtRmlsZXMgPSB3YXRjaGVkRmlsZXMubGVuZ3RoXG4gICAgICAgIHZhciBmaWxlc291cmNlID0gJ3RoaXMgZmlsZSBlbmFibGVzIGNsaWVudCByZWxvYWQnXG4gICAgICAgIGNvbXBpbGF0aW9uLmFzc2V0c1tjdXJyZW50TnVtRmlsZXMgKyAnRmlsZXNVbmRlckFwcEZvbGRlci5tZCddID0ge1xuICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24oKSB7cmV0dXJuIGZpbGVzb3VyY2V9LFxuICAgICAgICAgIHNpemU6IGZ1bmN0aW9uKCkge3JldHVybiBmaWxlc291cmNlLmxlbmd0aH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyZW50TnVtRmlsZXMgIT0gdGhpcy5sYXN0TnVtRmlsZXMgfHwgZG9CdWlsZCkge1xuICAgICAgICAgIHZhciBidWlsZCA9IHJlcXVpcmUoJ0BleHRqcy9zZW5jaGEtYnVpbGQvYXBwL2J1aWxkLmpzJylcbiAgICAgICAgICBuZXcgYnVpbGQoe30pXG4gICAgICAgICAgLy92YXIgcmVmcmVzaCA9IHJlcXVpcmUoJ0BleHRqcy9zZW5jaGEtYnVpbGQvYXBwL3JlZnJlc2guanMnKVxuICAgICAgICAgIC8vbmV3IHJlZnJlc2goe30pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYXBwICsgJ0NhbGwgdG8gU2VuY2hhIEJ1aWxkIG5vdCBuZWVkZWQsIG5vIG5ldyBmaWxlcycpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0TnVtRmlsZXMgPSBjdXJyZW50TnVtRmlsZXNcblxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb21waWxlci5wbHVnaW4oJ2VtaXQnLCAoY29tcGlsYXRpb24sIGNiKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFwcCArICdlbWl0JylcbiAgICAgICAgdmFyIGZpbGVsaXN0ID0gJ3RoaXMgZmlsZSBlbmFibGVzIGNsaWVudCByZWxvYWQnXG4gICAgICAgIGNvbXBpbGF0aW9uLmFzc2V0c1snRm9yUmVsb2FkLm1kJ10gPSB7XG4gICAgICAgICAgc291cmNlOiBmdW5jdGlvbigpIHtyZXR1cm4gZmlsZWxpc3R9LFxuICAgICAgICAgIHNpemU6IGZ1bmN0aW9uKCkge3JldHVybiBmaWxlbGlzdC5sZW5ndGh9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlZnJlc2ggPSByZXF1aXJlKCdAZXh0anMvc2VuY2hhLW5vZGUvYXBwL3JlZnJlc2guanMnKVxuICAgICAgICBuZXcgcmVmcmVzaCh7fSlcbiAgICAgICAgY2IoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgfVxufVxuXG5cblxuICAvLyBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAvLyAgIGZpbGVzLmZvckVhY2goKHBhdHRlcm4pID0+IHtcbiAgLy8gICAgIGxldCBmID0gcGF0dGVybjtcbiAgLy8gICAgIGlmIChpc0dsb2IocGF0dGVybikpIHtcbiAgLy8gICAgICAgZiA9IGdsb2Iuc3luYyhwYXR0ZXJuLCB7XG4gIC8vICAgICAgICAgY3dkLFxuICAvLyAgICAgICAgIGRvdDogdHJ1ZSxcbiAgLy8gICAgICAgICBhYnNvbHV0ZTogdHJ1ZSxcbiAgLy8gICAgICAgfSk7XG4gIC8vICAgICB9XG4gIC8vICAgICBmZHMgPSBmZHMuY29uY2F0KGYpO1xuICAvLyAgIH0pO1xuICAvLyAgIGZkcyA9IHVuaXEoZmRzKTtcbiAgLy8gfVxuXG5cbi8vIGZ1bmN0aW9uIGhvb2tfc3Rkb3V0KGNhbGxiYWNrKSB7XG4vLyAgIHZhciBvbGRfd3JpdGUgPSBwcm9jZXNzLnN0ZG91dC53cml0ZVxuLy8gICBjb25zb2xlLmxvZygnaW4gaG9vaycpXG4vLyAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlID0gKGZ1bmN0aW9uKHdyaXRlKSB7XG4vLyAgICAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nLCBlbmNvZGluZywgZmQpIHtcbi8vICAgICAgICAgICB3cml0ZS5hcHBseShwcm9jZXNzLnN0ZG91dCwgYXJndW1lbnRzKVxuLy8gICAgICAgICAgIGNhbGxiYWNrKHN0cmluZywgZW5jb2RpbmcsIGZkKVxuLy8gICAgICAgfVxuLy8gICB9KShwcm9jZXNzLnN0ZG91dC53cml0ZSlcblxuLy8gICByZXR1cm4gZnVuY3Rpb24oKSB7XG4vLyAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSA9IG9sZF93cml0ZVxuLy8gICAgICAgY29uc29sZS5sb2coJ2luIHVuaG9vaycpXG4vLyAgICAgfVxuLy8gfVxuICAgIC8vIHRoaXMudW5ob29rID0gaG9va19zdGRvdXQoZnVuY3Rpb24oc3RyaW5nLCBlbmNvZGluZywgZmQpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdzdGRvdXQ6ICcgKyBzdHJpbmcpXG4gICAgLy8gfSlcblxuLy8gICAgICAgIHRoaXMudW5ob29rKClcblxuXG5cblxuXG4gICAgICAgIC8vIHZhciBmaWxlbGlzdCA9ICdJbiB0aGlzIGJ1aWxkOlxcblxcbic7XG5cbiAgICAgICAgLy8gLy8gTG9vcCB0aHJvdWdoIGFsbCBjb21waWxlZCBhc3NldHMsXG4gICAgICAgIC8vIC8vIGFkZGluZyBhIG5ldyBsaW5lIGl0ZW0gZm9yIGVhY2ggZmlsZW5hbWUuXG4gICAgICAgIC8vIGZvciAodmFyIGZpbGVuYW1lIGluIGNvbXBpbGF0aW9uLmFzc2V0cykge1xuICAgICAgICAvLyAgIGZpbGVsaXN0ICs9ICgnLSAnKyBmaWxlbmFtZSArJ1xcbicpO1xuICAgICAgICAvLyB9XG4gICAgXG4gICAgICAgIC8vIC8vIEluc2VydCB0aGlzIGxpc3QgaW50byB0aGUgd2VicGFjayBidWlsZCBhcyBhIG5ldyBmaWxlIGFzc2V0OlxuICAgICAgICAvLyBjb21waWxhdGlvbi5hc3NldHNbJ2ZpbGVsaXN0Lm1kJ10gPSB7XG4gICAgICAgIC8vICAgc291cmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBmaWxlbGlzdDtcbiAgICAgICAgLy8gICB9LFxuICAgICAgICAvLyAgIHNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgcmV0dXJuIGZpbGVsaXN0Lmxlbmd0aDtcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vIH07XG5cblxuXG5cblxuICAgICAgICAvLyAvL3ZhciBkID0gbmV3IERhdGUoKVxuICAgICAgICAvLyB2YXIgZCA9ICdtamcnXG4gICAgICAgIC8vIHZhciBmaWxlbGlzdCA9ICdJbiB0aGlzIGJ1aWxkOlxcblxcbicgKyBkICsgJ1xcblxcbic7XG4gICAgICAgIC8vIC8vIExvb3AgdGhyb3VnaCBhbGwgY29tcGlsZWQgYXNzZXRzLFxuICAgICAgICAvLyAvLyBhZGRpbmcgYSBuZXcgbGluZSBpdGVtIGZvciBlYWNoIGZpbGVuYW1lLlxuICAgICAgICAvLyBmb3IgKHZhciBmaWxlbmFtZSBpbiBjb21waWxhdGlvbi5hc3NldHMpIHtcbiAgICAgICAgLy8gICBmaWxlbGlzdCArPSAoJy0gJysgZmlsZW5hbWUgKydcXG4nKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyAvLyBJbnNlcnQgdGhpcyBsaXN0IGludG8gdGhlIHdlYnBhY2sgYnVpbGQgYXMgYSBuZXcgZmlsZSBhc3NldDpcbiAgICAgICAgLy8gY29tcGlsYXRpb24uYXNzZXRzW2QgKyAnLm1kJ10gPSB7XG4gICAgICAgIC8vICAgc291cmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBmaWxlbGlzdDtcbiAgICAgICAgLy8gICB9LFxuICAgICAgICAvLyAgIHNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgcmV0dXJuIGZpbGVsaXN0Lmxlbmd0aDtcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vIH07Il19