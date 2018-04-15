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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var app = _chalk2.default.green('ℹ ｢ext｣:') + ' ExtJSWebpackPlugin: ';

function getFileAndContextDeps(compilation, files, dirs, cwd) {
  var fileDependencies = compilation.fileDependencies,
      contextDependencies = compilation.contextDependencies;

  var isWebpack4 = compilation.hooks;
  var fds = isWebpack4 ? [].concat(_toConsumableArray(fileDependencies)) : fileDependencies;
  var cds = isWebpack4 ? [].concat(_toConsumableArray(contextDependencies)) : contextDependencies;
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
  if (dirs.length > 0) {
    cds = (0, _lodash2.default)(cds.concat(dirs));
  }
  return {
    fileDependencies: fds,
    contextDependencies: cds
  };
}

var ExtraWatchWebpackPlugin = function () {
  function ExtraWatchWebpackPlugin() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ExtraWatchWebpackPlugin);

    process.stdout.cursorTo(0);console.log(app + 'constructor');
    (0, _schemaUtils2.default)(require('../options.json'), options, 'ExtraWatchWebpackPlugin'); // eslint-disable-line
    this.options = _extends({}, ExtraWatchWebpackPlugin.defaults, options);
  }

  _createClass(ExtraWatchWebpackPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

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
          process.stdout.cursorTo(0);
          console.log(app + 'extjs-emit');

          var recursiveReadSync = require('recursive-readdir-sync');
          var files = [];
          try {
            files = recursiveReadSync('./app');
          } catch (err) {
            if (err.errno === 34) {
              console.log('Path does not exist');
            } else {
              throw err;
            }
          }

          var doBuild = false;
          for (var file in files) {
            if (_this.lastMilliseconds < _fs2.default.statSync(files[file]).mtimeMs) {
              if (files[file].indexOf("scss") != -1) {
                doBuild = true;break;
              }
            }
          }
          _this.lastMilliseconds = new Date().getTime();

          var currentNumFiles = files.length;
          var filesource = 'this file enables client reload';
          compilation.assets[currentNumFiles + 'FilesForReload.md'] = {
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
            console.log(app + 'Call to Sencha Builder not needed, no new files');
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

  return ExtraWatchWebpackPlugin;
}();

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


ExtraWatchWebpackPlugin.defaults = {
  cwd: process.cwd(),
  files: [],
  dirs: []
};
exports.default = ExtraWatchWebpackPlugin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJncmVlbiIsImdldEZpbGVBbmRDb250ZXh0RGVwcyIsImNvbXBpbGF0aW9uIiwiZmlsZXMiLCJkaXJzIiwiY3dkIiwiZmlsZURlcGVuZGVuY2llcyIsImNvbnRleHREZXBlbmRlbmNpZXMiLCJpc1dlYnBhY2s0IiwiaG9va3MiLCJmZHMiLCJjZHMiLCJsZW5ndGgiLCJjb25jYXQiLCJFeHRyYVdhdGNoV2VicGFja1BsdWdpbiIsIm9wdGlvbnMiLCJwcm9jZXNzIiwic3Rkb3V0IiwiY3Vyc29yVG8iLCJjb25zb2xlIiwibG9nIiwicmVxdWlyZSIsImRlZmF1bHRzIiwiY29tcGlsZXIiLCJhZnRlckNvbXBpbGUiLCJ0YXAiLCJmb3JFYWNoIiwiZmlsZSIsImFkZCIsImNvbnRleHQiLCJwbHVnaW4iLCJjYiIsImVtaXQiLCJyZWN1cnNpdmVSZWFkU3luYyIsImVyciIsImVycm5vIiwiZG9CdWlsZCIsImxhc3RNaWxsaXNlY29uZHMiLCJzdGF0U3luYyIsIm10aW1lTXMiLCJpbmRleE9mIiwiRGF0ZSIsImdldFRpbWUiLCJjdXJyZW50TnVtRmlsZXMiLCJmaWxlc291cmNlIiwiYXNzZXRzIiwic291cmNlIiwic2l6ZSIsImxhc3ROdW1GaWxlcyIsImJ1aWxkIiwiZmlsZWxpc3QiLCJyZWZyZXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBQ0EsSUFBTUEsTUFBUyxnQkFBTUMsS0FBTixDQUFZLFVBQVosQ0FBVCwwQkFBTjs7QUFFQSxTQUFTQyxxQkFBVCxDQUErQkMsV0FBL0IsRUFBNENDLEtBQTVDLEVBQW1EQyxJQUFuRCxFQUF5REMsR0FBekQsRUFBOEQ7QUFBQSxNQUNwREMsZ0JBRG9ELEdBQ1ZKLFdBRFUsQ0FDcERJLGdCQURvRDtBQUFBLE1BQ2xDQyxtQkFEa0MsR0FDVkwsV0FEVSxD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SUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7O0FBRUo7OztBQU1ROztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUE3S2FqQix1QixDQUNaUSxRLEdBQVc7QUFDaEJqQixPQUFLVyxRQUFRWCxHQUFSLEVBRFc7QUFFaEJGLFNBQU8sRUFGUztBQUdoQkMsUUFBTTtBQUhVLEM7a0JBRENVLHVCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgdmFsaWRhdGVPcHRpb25zIGZyb20gJ3NjaGVtYS11dGlscyc7XG5pbXBvcnQgdW5pcSBmcm9tICdsb2Rhc2gudW5pcSc7XG5pbXBvcnQgaXNHbG9iIGZyb20gJ2lzLWdsb2InO1xuaW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5jb25zdCBhcHAgPSBgJHtjaGFsay5ncmVlbign4oS5IO+9omV4dO+9ozonKX0gRXh0SlNXZWJwYWNrUGx1Z2luOiBgO1xuXG5mdW5jdGlvbiBnZXRGaWxlQW5kQ29udGV4dERlcHMoY29tcGlsYXRpb24sIGZpbGVzLCBkaXJzLCBjd2QpIHtcbiAgY29uc3QgeyBmaWxlRGVwZW5kZW5jaWVzLCBjb250ZXh0RGVwZW5kZW5jaWVzIH0gPSBjb21waWxhdGlvbjtcbiAgY29uc3QgaXNXZWJwYWNrNCA9IGNvbXBpbGF0aW9uLmhvb2tzO1xuICBsZXQgZmRzID0gaXNXZWJwYWNrNCA/IFsuLi5maWxlRGVwZW5kZW5jaWVzXSA6IGZpbGVEZXBlbmRlbmNpZXM7XG4gIGxldCBjZHMgPSBpc1dlYnBhY2s0ID8gWy4uLmNvbnRleHREZXBlbmRlbmNpZXNdIDogY29udGV4dERlcGVuZGVuY2llcztcbiAgLy8gaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgLy8gICBmaWxlcy5mb3JFYWNoKChwYXR0ZXJuKSA9PiB7XG4gIC8vICAgICBsZXQgZiA9IHBhdHRlcm47XG4gIC8vICAgICBpZiAoaXNHbG9iKHBhdHRlcm4pKSB7XG4gIC8vICAgICAgIGYgPSBnbG9iLnN5bmMocGF0dGVybiwge1xuICAvLyAgICAgICAgIGN3ZCxcbiAgLy8gICAgICAgICBkb3Q6IHRydWUsXG4gIC8vICAgICAgICAgYWJzb2x1dGU6IHRydWUsXG4gIC8vICAgICAgIH0pO1xuICAvLyAgICAgfVxuICAvLyAgICAgZmRzID0gZmRzLmNvbmNhdChmKTtcbiAgLy8gICB9KTtcbiAgLy8gICBmZHMgPSB1bmlxKGZkcyk7XG4gIC8vIH1cbiAgaWYgKGRpcnMubGVuZ3RoID4gMCkge1xuICAgIGNkcyA9IHVuaXEoY2RzLmNvbmNhdChkaXJzKSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBmaWxlRGVwZW5kZW5jaWVzOiBmZHMsXG4gICAgY29udGV4dERlcGVuZGVuY2llczogY2RzLFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHRyYVdhdGNoV2VicGFja1BsdWdpbiB7XG4gIHN0YXRpYyBkZWZhdWx0cyA9IHtcbiAgICBjd2Q6IHByb2Nlc3MuY3dkKCksXG4gICAgZmlsZXM6IFtdLFxuICAgIGRpcnM6IFtdLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHByb2Nlc3Muc3Rkb3V0LmN1cnNvclRvKDApO2NvbnNvbGUubG9nKGFwcCArICdjb25zdHJ1Y3RvcicpXG4gICAgdmFsaWRhdGVPcHRpb25zKHJlcXVpcmUoJy4uL29wdGlvbnMuanNvbicpLCBvcHRpb25zLCAnRXh0cmFXYXRjaFdlYnBhY2tQbHVnaW4nKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uRXh0cmFXYXRjaFdlYnBhY2tQbHVnaW4uZGVmYXVsdHMsIC4uLm9wdGlvbnMgfTtcbiAgfVxuXG4gIGFwcGx5KGNvbXBpbGVyKSB7XG4gICAgbGV0IHsgZmlsZXMsIGRpcnMgfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCB7IGN3ZCB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGZpbGVzID0gdHlwZW9mIGZpbGVzID09PSAnc3RyaW5nJyA/IFtmaWxlc10gOiBmaWxlcztcbiAgICBkaXJzID0gdHlwZW9mIGRpcnMgPT09ICdzdHJpbmcnID8gW2RpcnNdIDogZGlycztcblxuICAgIGlmIChjb21waWxlci5ob29rcykge1xuICAgICAgY29tcGlsZXIuaG9va3MuYWZ0ZXJDb21waWxlLnRhcCgnZXh0anMtYWZ0ZXItY29tcGlsZScsIChjb21waWxhdGlvbikgPT4ge1xuICAgICAgICBwcm9jZXNzLnN0ZG91dC5jdXJzb3JUbygwKTtjb25zb2xlLmxvZyhhcHAgKyAnZXh0anMtYWZ0ZXItY29tcGlsZScpXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBmaWxlRGVwZW5kZW5jaWVzLFxuICAgICAgICAgIGNvbnRleHREZXBlbmRlbmNpZXMsXG4gICAgICAgIH0gPSBnZXRGaWxlQW5kQ29udGV4dERlcHMoY29tcGlsYXRpb24sIGZpbGVzLCBkaXJzLCBjd2QpO1xuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpbGVEZXBlbmRlbmNpZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICAgICAgY29tcGlsYXRpb24uZmlsZURlcGVuZGVuY2llcy5hZGQocmVzb2x2ZShmaWxlKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnRleHREZXBlbmRlbmNpZXMuZm9yRWFjaCgoY29udGV4dCkgPT4ge1xuICAgICAgICAgICAgY29tcGlsYXRpb24uY29udGV4dERlcGVuZGVuY2llcy5hZGQoY29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21waWxlci5wbHVnaW4oJ2FmdGVyLWNvbXBpbGUnLCAoY29tcGlsYXRpb24sIGNiKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFwcCArICdhZnRlci1jb21waWxlJylcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGZpbGVEZXBlbmRlbmNpZXMsXG4gICAgICAgICAgY29udGV4dERlcGVuZGVuY2llcyxcbiAgICAgICAgfSA9IGdldEZpbGVBbmRDb250ZXh0RGVwcyhjb21waWxhdGlvbiwgZmlsZXMsIGRpcnMsIGN3ZCk7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29tcGlsYXRpb24uZmlsZURlcGVuZGVuY2llcyA9IGZpbGVEZXBlbmRlbmNpZXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29tcGlsYXRpb24uY29udGV4dERlcGVuZGVuY2llcyA9IGNvbnRleHREZXBlbmRlbmNpZXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfVxuICAgICAgICBjYigpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY29tcGlsZXIuaG9va3MpIHtcbiAgICAgIGNvbXBpbGVyLmhvb2tzLmVtaXQudGFwKCdleHRqcy1lbWl0JywgKGNvbXBpbGF0aW9uKSA9PiB7XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LmN1cnNvclRvKDApXG4gICAgICAgIGNvbnNvbGUubG9nKGFwcCArICdleHRqcy1lbWl0JylcblxuICAgICAgICB2YXIgcmVjdXJzaXZlUmVhZFN5bmMgPSByZXF1aXJlKCdyZWN1cnNpdmUtcmVhZGRpci1zeW5jJylcbiAgICAgICAgdmFyIGZpbGVzPVtdXG4gICAgICAgIHRyeSB7ZmlsZXMgPSByZWN1cnNpdmVSZWFkU3luYygnLi9hcHAnKX0gXG4gICAgICAgIGNhdGNoKGVycikge2lmKGVyci5lcnJubyA9PT0gMzQpe2NvbnNvbGUubG9nKCdQYXRoIGRvZXMgbm90IGV4aXN0Jyk7fSBlbHNlIHt0aHJvdyBlcnI7fX1cblxuICAgICAgICB2YXIgZG9CdWlsZCA9IGZhbHNlXG4gICAgICAgIGZvciAodmFyIGZpbGUgaW4gZmlsZXMpIHtcbiAgICAgICAgICBpZiAodGhpcy5sYXN0TWlsbGlzZWNvbmRzIDwgZnMuc3RhdFN5bmMoZmlsZXNbZmlsZV0pLm10aW1lTXMpIHtcbiAgICAgICAgICAgIGlmIChmaWxlc1tmaWxlXS5pbmRleE9mKFwic2Nzc1wiKSAhPSAtMSkge2RvQnVpbGQ9dHJ1ZTticmVhazt9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdE1pbGxpc2Vjb25kcyA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpXG5cbiAgICAgICAgdmFyIGN1cnJlbnROdW1GaWxlcyA9IGZpbGVzLmxlbmd0aFxuICAgICAgICB2YXIgZmlsZXNvdXJjZSA9ICd0aGlzIGZpbGUgZW5hYmxlcyBjbGllbnQgcmVsb2FkJ1xuICAgICAgICBjb21waWxhdGlvbi5hc3NldHNbY3VycmVudE51bUZpbGVzICsgJ0ZpbGVzRm9yUmVsb2FkLm1kJ10gPSB7XG4gICAgICAgICAgc291cmNlOiBmdW5jdGlvbigpIHtyZXR1cm4gZmlsZXNvdXJjZX0sXG4gICAgICAgICAgc2l6ZTogZnVuY3Rpb24oKSB7cmV0dXJuIGZpbGVzb3VyY2UubGVuZ3RofVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnROdW1GaWxlcyAhPSB0aGlzLmxhc3ROdW1GaWxlcyB8fCBkb0J1aWxkKSB7XG4gICAgICAgICAgdmFyIGJ1aWxkID0gcmVxdWlyZSgnQGV4dGpzL3NlbmNoYS1idWlsZGVyL2FwcC9idWlsZC5qcycpXG4gICAgICAgICAgbmV3IGJ1aWxkKHt9KVxuICAgICAgICAgIC8vdmFyIHJlZnJlc2ggPSByZXF1aXJlKCdAZXh0anMvc2VuY2hhLWJ1aWxkZXIvYXBwL3JlZnJlc2guanMnKVxuICAgICAgICAgIC8vbmV3IHJlZnJlc2goe30pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYXBwICsgJ0NhbGwgdG8gU2VuY2hhIEJ1aWxkZXIgbm90IG5lZWRlZCwgbm8gbmV3IGZpbGVzJylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhc3ROdW1GaWxlcyA9IGN1cnJlbnROdW1GaWxlc1xuXG4gICAgICB9KVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbXBpbGVyLnBsdWdpbignZW1pdCcsIChjb21waWxhdGlvbiwgY2IpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYXBwICsgJ2VtaXQnKVxuICAgICAgICB2YXIgZmlsZWxpc3QgPSAndGhpcyBmaWxlIGVuYWJsZXMgY2xpZW50IHJlbG9hZCdcbiAgICAgICAgY29tcGlsYXRpb24uYXNzZXRzWydGb3JSZWxvYWQubWQnXSA9IHtcbiAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uKCkge3JldHVybiBmaWxlbGlzdH0sXG4gICAgICAgICAgc2l6ZTogZnVuY3Rpb24oKSB7cmV0dXJuIGZpbGVsaXN0Lmxlbmd0aH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVmcmVzaCA9IHJlcXVpcmUoJ0BleHRqcy9zZW5jaGEtbm9kZS9hcHAvcmVmcmVzaC5qcycpXG4gICAgICAgIG5ldyByZWZyZXNoKHt9KVxuICAgICAgICBjYigpXG4gICAgICB9KVxuICAgIH1cblxuICB9XG59XG5cblxuLy8gZnVuY3Rpb24gaG9va19zdGRvdXQoY2FsbGJhY2spIHtcbi8vICAgdmFyIG9sZF93cml0ZSA9IHByb2Nlc3Muc3Rkb3V0LndyaXRlXG4vLyAgIGNvbnNvbGUubG9nKCdpbiBob29rJylcbi8vICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgPSAoZnVuY3Rpb24od3JpdGUpIHtcbi8vICAgICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcsIGVuY29kaW5nLCBmZCkge1xuLy8gICAgICAgICAgIHdyaXRlLmFwcGx5KHByb2Nlc3Muc3Rkb3V0LCBhcmd1bWVudHMpXG4vLyAgICAgICAgICAgY2FsbGJhY2soc3RyaW5nLCBlbmNvZGluZywgZmQpXG4vLyAgICAgICB9XG4vLyAgIH0pKHByb2Nlc3Muc3Rkb3V0LndyaXRlKVxuXG4vLyAgIHJldHVybiBmdW5jdGlvbigpIHtcbi8vICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlID0gb2xkX3dyaXRlXG4vLyAgICAgICBjb25zb2xlLmxvZygnaW4gdW5ob29rJylcbi8vICAgICB9XG4vLyB9XG4gICAgLy8gdGhpcy51bmhvb2sgPSBob29rX3N0ZG91dChmdW5jdGlvbihzdHJpbmcsIGVuY29kaW5nLCBmZCkge1xuICAgIC8vICAgY29uc29sZS5sb2coJ3N0ZG91dDogJyArIHN0cmluZylcbiAgICAvLyB9KVxuXG4vLyAgICAgICAgdGhpcy51bmhvb2soKVxuXG5cblxuXG5cbiAgICAgICAgLy8gdmFyIGZpbGVsaXN0ID0gJ0luIHRoaXMgYnVpbGQ6XFxuXFxuJztcblxuICAgICAgICAvLyAvLyBMb29wIHRocm91Z2ggYWxsIGNvbXBpbGVkIGFzc2V0cyxcbiAgICAgICAgLy8gLy8gYWRkaW5nIGEgbmV3IGxpbmUgaXRlbSBmb3IgZWFjaCBmaWxlbmFtZS5cbiAgICAgICAgLy8gZm9yICh2YXIgZmlsZW5hbWUgaW4gY29tcGlsYXRpb24uYXNzZXRzKSB7XG4gICAgICAgIC8vICAgZmlsZWxpc3QgKz0gKCctICcrIGZpbGVuYW1lICsnXFxuJyk7XG4gICAgICAgIC8vIH1cbiAgICBcbiAgICAgICAgLy8gLy8gSW5zZXJ0IHRoaXMgbGlzdCBpbnRvIHRoZSB3ZWJwYWNrIGJ1aWxkIGFzIGEgbmV3IGZpbGUgYXNzZXQ6XG4gICAgICAgIC8vIGNvbXBpbGF0aW9uLmFzc2V0c1snZmlsZWxpc3QubWQnXSA9IHtcbiAgICAgICAgLy8gICBzb3VyY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgcmV0dXJuIGZpbGVsaXN0O1xuICAgICAgICAvLyAgIH0sXG4gICAgICAgIC8vICAgc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gZmlsZWxpc3QubGVuZ3RoO1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gfTtcblxuXG5cblxuXG4gICAgICAgIC8vIC8vdmFyIGQgPSBuZXcgRGF0ZSgpXG4gICAgICAgIC8vIHZhciBkID0gJ21qZydcbiAgICAgICAgLy8gdmFyIGZpbGVsaXN0ID0gJ0luIHRoaXMgYnVpbGQ6XFxuXFxuJyArIGQgKyAnXFxuXFxuJztcbiAgICAgICAgLy8gLy8gTG9vcCB0aHJvdWdoIGFsbCBjb21waWxlZCBhc3NldHMsXG4gICAgICAgIC8vIC8vIGFkZGluZyBhIG5ldyBsaW5lIGl0ZW0gZm9yIGVhY2ggZmlsZW5hbWUuXG4gICAgICAgIC8vIGZvciAodmFyIGZpbGVuYW1lIGluIGNvbXBpbGF0aW9uLmFzc2V0cykge1xuICAgICAgICAvLyAgIGZpbGVsaXN0ICs9ICgnLSAnKyBmaWxlbmFtZSArJ1xcbicpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIC8vIEluc2VydCB0aGlzIGxpc3QgaW50byB0aGUgd2VicGFjayBidWlsZCBhcyBhIG5ldyBmaWxlIGFzc2V0OlxuICAgICAgICAvLyBjb21waWxhdGlvbi5hc3NldHNbZCArICcubWQnXSA9IHtcbiAgICAgICAgLy8gICBzb3VyY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgcmV0dXJuIGZpbGVsaXN0O1xuICAgICAgICAvLyAgIH0sXG4gICAgICAgIC8vICAgc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gZmlsZWxpc3QubGVuZ3RoO1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gfTsiXX0=