'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } //var chalk = require('chalk')


var app = _chalk2.default.green('ℹ ｢ext｣:') + ' ExtJSWebpackPlugin: ';

function getFileAndContextDeps(compilation, files, dirs, cwd) {
  var fileDependencies = compilation.fileDependencies,
      contextDependencies = compilation.contextDependencies;

  var isWebpack4 = compilation.hooks;
  var fds = isWebpack4 ? [].concat(_toConsumableArray(fileDependencies)) : fileDependencies;
  var cds = isWebpack4 ? [].concat(_toConsumableArray(contextDependencies)) : contextDependencies;
  if (files.length > 0) {
    files.forEach(function (pattern) {
      var f = pattern;
      if ((0, _isGlob2.default)(pattern)) {
        f = _glob2.default.sync(pattern, {
          cwd: cwd,
          dot: true,
          absolute: true
        });
      }
      fds = fds.concat(f);
    });
    fds = (0, _lodash2.default)(fds);
  }
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
          var files;

          try {
            files = recursiveReadSync('./app');
          } catch (err) {
            if (err.errno === 34) {
              console.log('Path does not exist');
            } else {
              //something unrelated went wrong, rethrow 
              throw err;
            }
          }

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

          if (currentNumFiles != _this.lastNumFiles) {
            //var build = require('@extjs/sencha-builder/app/build.js')
            //new build({})
            var refresh = require('@extjs/sencha-builder/app/refresh.js');
            //var refresh = require('@extjs/sencha-builder/refresh')
            new refresh({});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJncmVlbiIsImdldEZpbGVBbmRDb250ZXh0RGVwcyIsImNvbXBpbGF0aW9uIiwiZmlsZXMiLCJkaXJzIiwiY3dkIiwiZmlsZURlcGVuZGVuY2llcyIsImNvbnRleHREZXBlbmRlbmNpZXMiLCJpc1dlYnBhY2s0IiwiaG9va3MiLCJmZHMiLCJjZHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwicGF0dGVybiIsImYiLCJzeW5jIiwiZG90IiwiYWJzb2x1dGUiLCJjb25jYXQiLCJFeHRyYVdhdGNoV2VicGFja1BsdWdpbiIsIm9wdGlvbnMiLCJwcm9jZXNzIiwic3Rkb3V0IiwiY3Vyc29yVG8iLCJjb25zb2xlIiwibG9nIiwicmVxdWlyZSIsImRlZmF1bHRzIiwiY29tcGlsZXIiLCJhZnRlckNvbXBpbGUiLCJ0YXAiLCJmaWxlIiwiYWRkIiwiY29udGV4dCIsInBsdWdpbiIsImNiIiwiZW1pdCIsInJlY3Vyc2l2ZVJlYWRTeW5jIiwiZXJyIiwiZXJybm8iLCJjdXJyZW50TnVtRmlsZXMiLCJmaWxlc291cmNlIiwiYXNzZXRzIiwic291cmNlIiwic2l6ZSIsImxhc3ROdW1GaWxlcyIsInJlZnJlc2giLCJmaWxlbGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O29NQU5BOzs7QUFPQSxJQUFNQSxNQUFTLGdCQUFNQyxLQUFOLENBQVksVUFBWixDQUFULDBCQUFOOztBQUVBLFNBQVNDLHFCQUFULENBQStCQyxXQUEvQixFQUE0Q0MsS0FBNUMsRUFBbURDLElBQW5ELEVBQXlEQyxHQUF6RCxFQUE4RDtBQUFBLE1BQ3BEQyxnQkFEb0QsR0FDVkosV0FEVSxDQUNwREksZ0JBRG9EO0FBQUEsTUFDbENDLG1CQURrQyxHQUNWTCxXQURVLENBQ2xDSyxtQkFEa0M7O0FBRTVELE1BQU1DLGFBQWFOLFlBQVlPLEtBQS9CO0FBQ0Es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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUEvS2FoQix1QixDQUNaUSxRLEdBQVc7QUFDaEJ2QixPQUFLaUIsUUFBUWpCLEdBQVIsRUFEVztBQUVoQkYsU0FBTyxFQUZTO0FBR2hCQyxRQUFNO0FBSFUsQztrQkFEQ2dCLHVCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy92YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IHZhbGlkYXRlT3B0aW9ucyBmcm9tICdzY2hlbWEtdXRpbHMnO1xuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IGlzR2xvYiBmcm9tICdpcy1nbG9iJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuY29uc3QgYXBwID0gYCR7Y2hhbGsuZ3JlZW4oJ+KEuSDvvaJleHTvvaM6Jyl9IEV4dEpTV2VicGFja1BsdWdpbjogYDtcblxuZnVuY3Rpb24gZ2V0RmlsZUFuZENvbnRleHREZXBzKGNvbXBpbGF0aW9uLCBmaWxlcywgZGlycywgY3dkKSB7XG4gIGNvbnN0IHsgZmlsZURlcGVuZGVuY2llcywgY29udGV4dERlcGVuZGVuY2llcyB9ID0gY29tcGlsYXRpb247XG4gIGNvbnN0IGlzV2VicGFjazQgPSBjb21waWxhdGlvbi5ob29rcztcbiAgbGV0IGZkcyA9IGlzV2VicGFjazQgPyBbLi4uZmlsZURlcGVuZGVuY2llc10gOiBmaWxlRGVwZW5kZW5jaWVzO1xuICBsZXQgY2RzID0gaXNXZWJwYWNrNCA/IFsuLi5jb250ZXh0RGVwZW5kZW5jaWVzXSA6IGNvbnRleHREZXBlbmRlbmNpZXM7XG4gIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgZmlsZXMuZm9yRWFjaCgocGF0dGVybikgPT4ge1xuICAgICAgbGV0IGYgPSBwYXR0ZXJuO1xuICAgICAgaWYgKGlzR2xvYihwYXR0ZXJuKSkge1xuICAgICAgICBmID0gZ2xvYi5zeW5jKHBhdHRlcm4sIHtcbiAgICAgICAgICBjd2QsXG4gICAgICAgICAgZG90OiB0cnVlLFxuICAgICAgICAgIGFic29sdXRlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGZkcyA9IGZkcy5jb25jYXQoZik7XG4gICAgfSk7XG4gICAgZmRzID0gdW5pcShmZHMpO1xuICB9XG4gIGlmIChkaXJzLmxlbmd0aCA+IDApIHtcbiAgICBjZHMgPSB1bmlxKGNkcy5jb25jYXQoZGlycykpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZmlsZURlcGVuZGVuY2llczogZmRzLFxuICAgIGNvbnRleHREZXBlbmRlbmNpZXM6IGNkcyxcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXh0cmFXYXRjaFdlYnBhY2tQbHVnaW4ge1xuICBzdGF0aWMgZGVmYXVsdHMgPSB7XG4gICAgY3dkOiBwcm9jZXNzLmN3ZCgpLFxuICAgIGZpbGVzOiBbXSxcbiAgICBkaXJzOiBbXSxcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBwcm9jZXNzLnN0ZG91dC5jdXJzb3JUbygwKTtjb25zb2xlLmxvZyhhcHAgKyAnY29uc3RydWN0b3InKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhyZXF1aXJlKCcuLi9vcHRpb25zLmpzb24nKSwgb3B0aW9ucywgJ0V4dHJhV2F0Y2hXZWJwYWNrUGx1Z2luJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB0aGlzLm9wdGlvbnMgPSB7IC4uLkV4dHJhV2F0Y2hXZWJwYWNrUGx1Z2luLmRlZmF1bHRzLCAuLi5vcHRpb25zIH07XG4gIH1cblxuICBhcHBseShjb21waWxlcikge1xuICAgIGxldCB7IGZpbGVzLCBkaXJzIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3QgeyBjd2QgfSA9IHRoaXMub3B0aW9ucztcbiAgICBmaWxlcyA9IHR5cGVvZiBmaWxlcyA9PT0gJ3N0cmluZycgPyBbZmlsZXNdIDogZmlsZXM7XG4gICAgZGlycyA9IHR5cGVvZiBkaXJzID09PSAnc3RyaW5nJyA/IFtkaXJzXSA6IGRpcnM7XG5cbiAgICBpZiAoY29tcGlsZXIuaG9va3MpIHtcbiAgICAgIGNvbXBpbGVyLmhvb2tzLmFmdGVyQ29tcGlsZS50YXAoJ2V4dGpzLWFmdGVyLWNvbXBpbGUnLCAoY29tcGlsYXRpb24pID0+IHtcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQuY3Vyc29yVG8oMCk7Y29uc29sZS5sb2coYXBwICsgJ2V4dGpzLWFmdGVyLWNvbXBpbGUnKVxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgZmlsZURlcGVuZGVuY2llcyxcbiAgICAgICAgICBjb250ZXh0RGVwZW5kZW5jaWVzLFxuICAgICAgICB9ID0gZ2V0RmlsZUFuZENvbnRleHREZXBzKGNvbXBpbGF0aW9uLCBmaWxlcywgZGlycywgY3dkKTtcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWxlRGVwZW5kZW5jaWVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uLmZpbGVEZXBlbmRlbmNpZXMuYWRkKHJlc29sdmUoZmlsZSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb250ZXh0RGVwZW5kZW5jaWVzLmZvckVhY2goKGNvbnRleHQpID0+IHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uLmNvbnRleHREZXBlbmRlbmNpZXMuYWRkKGNvbnRleHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGlsZXIucGx1Z2luKCdhZnRlci1jb21waWxlJywgKGNvbXBpbGF0aW9uLCBjYikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhhcHAgKyAnYWZ0ZXItY29tcGlsZScpXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBmaWxlRGVwZW5kZW5jaWVzLFxuICAgICAgICAgIGNvbnRleHREZXBlbmRlbmNpZXMsXG4gICAgICAgIH0gPSBnZXRGaWxlQW5kQ29udGV4dERlcHMoY29tcGlsYXRpb24sIGZpbGVzLCBkaXJzLCBjd2QpO1xuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbXBpbGF0aW9uLmZpbGVEZXBlbmRlbmNpZXMgPSBmaWxlRGVwZW5kZW5jaWVzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbXBpbGF0aW9uLmNvbnRleHREZXBlbmRlbmNpZXMgPSBjb250ZXh0RGVwZW5kZW5jaWVzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIH1cbiAgICAgICAgY2IoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbXBpbGVyLmhvb2tzKSB7XG4gICAgICBjb21waWxlci5ob29rcy5lbWl0LnRhcCgnZXh0anMtZW1pdCcsIChjb21waWxhdGlvbikgPT4ge1xuICAgICAgICBwcm9jZXNzLnN0ZG91dC5jdXJzb3JUbygwKVxuICAgICAgICBjb25zb2xlLmxvZyhhcHAgKyAnZXh0anMtZW1pdCcpXG5cbiAgICAgICAgdmFyIHJlY3Vyc2l2ZVJlYWRTeW5jID0gcmVxdWlyZSgncmVjdXJzaXZlLXJlYWRkaXItc3luYycpXG4gICAgICAgIHZhciBmaWxlc1xuICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpbGVzID0gcmVjdXJzaXZlUmVhZFN5bmMoJy4vYXBwJyk7XG4gICAgICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgICBpZihlcnIuZXJybm8gPT09IDM0KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQYXRoIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vc29tZXRoaW5nIHVucmVsYXRlZCB3ZW50IHdyb25nLCByZXRocm93IFxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjdXJyZW50TnVtRmlsZXMgPSBmaWxlcy5sZW5ndGhcbiBcbiAgICAgICAgdmFyIGZpbGVzb3VyY2UgPSAndGhpcyBmaWxlIGVuYWJsZXMgY2xpZW50IHJlbG9hZCdcbiAgICAgICAgY29tcGlsYXRpb24uYXNzZXRzW2N1cnJlbnROdW1GaWxlcyArICdGaWxlc0ZvclJlbG9hZC5tZCddID0ge1xuICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24oKSB7cmV0dXJuIGZpbGVzb3VyY2V9LFxuICAgICAgICAgIHNpemU6IGZ1bmN0aW9uKCkge3JldHVybiBmaWxlc291cmNlLmxlbmd0aH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyZW50TnVtRmlsZXMgIT0gdGhpcy5sYXN0TnVtRmlsZXMpIHtcbiAgICAgICAgICAvL3ZhciBidWlsZCA9IHJlcXVpcmUoJ0BleHRqcy9zZW5jaGEtYnVpbGRlci9hcHAvYnVpbGQuanMnKVxuICAgICAgICAgIC8vbmV3IGJ1aWxkKHt9KVxuICAgICAgICAgIHZhciByZWZyZXNoID0gcmVxdWlyZSgnQGV4dGpzL3NlbmNoYS1idWlsZGVyL2FwcC9yZWZyZXNoLmpzJylcbiAgICAgICAgICAvL3ZhciByZWZyZXNoID0gcmVxdWlyZSgnQGV4dGpzL3NlbmNoYS1idWlsZGVyL3JlZnJlc2gnKVxuICAgICAgICAgIG5ldyByZWZyZXNoKHt9KVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGFwcCArICdDYWxsIHRvIFNlbmNoYSBCdWlsZGVyIG5vdCBuZWVkZWQsIG5vIG5ldyBmaWxlcycpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0TnVtRmlsZXMgPSBjdXJyZW50TnVtRmlsZXNcbiAgICAgIH0pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29tcGlsZXIucGx1Z2luKCdlbWl0JywgKGNvbXBpbGF0aW9uLCBjYikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhhcHAgKyAnZW1pdCcpXG4gICAgICAgIHZhciBmaWxlbGlzdCA9ICd0aGlzIGZpbGUgZW5hYmxlcyBjbGllbnQgcmVsb2FkJ1xuICAgICAgICBjb21waWxhdGlvbi5hc3NldHNbJ0ZvclJlbG9hZC5tZCddID0ge1xuICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24oKSB7cmV0dXJuIGZpbGVsaXN0fSxcbiAgICAgICAgICBzaXplOiBmdW5jdGlvbigpIHtyZXR1cm4gZmlsZWxpc3QubGVuZ3RofVxuICAgICAgICB9XG4gICAgICAgIHZhciByZWZyZXNoID0gcmVxdWlyZSgnQGV4dGpzL3NlbmNoYS1ub2RlL2FwcC9yZWZyZXNoLmpzJylcbiAgICAgICAgbmV3IHJlZnJlc2goe30pXG4gICAgICAgIGNiKClcbiAgICAgIH0pXG4gICAgfVxuXG4gIH1cbn1cblxuXG4vLyBmdW5jdGlvbiBob29rX3N0ZG91dChjYWxsYmFjaykge1xuLy8gICB2YXIgb2xkX3dyaXRlID0gcHJvY2Vzcy5zdGRvdXQud3JpdGVcbi8vICAgY29uc29sZS5sb2coJ2luIGhvb2snKVxuLy8gICBwcm9jZXNzLnN0ZG91dC53cml0ZSA9IChmdW5jdGlvbih3cml0ZSkge1xuLy8gICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZywgZW5jb2RpbmcsIGZkKSB7XG4vLyAgICAgICAgICAgd3JpdGUuYXBwbHkocHJvY2Vzcy5zdGRvdXQsIGFyZ3VtZW50cylcbi8vICAgICAgICAgICBjYWxsYmFjayhzdHJpbmcsIGVuY29kaW5nLCBmZClcbi8vICAgICAgIH1cbi8vICAgfSkocHJvY2Vzcy5zdGRvdXQud3JpdGUpXG5cbi8vICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuLy8gICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgPSBvbGRfd3JpdGVcbi8vICAgICAgIGNvbnNvbGUubG9nKCdpbiB1bmhvb2snKVxuLy8gICAgIH1cbi8vIH1cbiAgICAvLyB0aGlzLnVuaG9vayA9IGhvb2tfc3Rkb3V0KGZ1bmN0aW9uKHN0cmluZywgZW5jb2RpbmcsIGZkKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnc3Rkb3V0OiAnICsgc3RyaW5nKVxuICAgIC8vIH0pXG5cbi8vICAgICAgICB0aGlzLnVuaG9vaygpXG5cblxuXG5cblxuICAgICAgICAvLyB2YXIgZmlsZWxpc3QgPSAnSW4gdGhpcyBidWlsZDpcXG5cXG4nO1xuXG4gICAgICAgIC8vIC8vIExvb3AgdGhyb3VnaCBhbGwgY29tcGlsZWQgYXNzZXRzLFxuICAgICAgICAvLyAvLyBhZGRpbmcgYSBuZXcgbGluZSBpdGVtIGZvciBlYWNoIGZpbGVuYW1lLlxuICAgICAgICAvLyBmb3IgKHZhciBmaWxlbmFtZSBpbiBjb21waWxhdGlvbi5hc3NldHMpIHtcbiAgICAgICAgLy8gICBmaWxlbGlzdCArPSAoJy0gJysgZmlsZW5hbWUgKydcXG4nKTtcbiAgICAgICAgLy8gfVxuICAgIFxuICAgICAgICAvLyAvLyBJbnNlcnQgdGhpcyBsaXN0IGludG8gdGhlIHdlYnBhY2sgYnVpbGQgYXMgYSBuZXcgZmlsZSBhc3NldDpcbiAgICAgICAgLy8gY29tcGlsYXRpb24uYXNzZXRzWydmaWxlbGlzdC5tZCddID0ge1xuICAgICAgICAvLyAgIHNvdXJjZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gZmlsZWxpc3Q7XG4gICAgICAgIC8vICAgfSxcbiAgICAgICAgLy8gICBzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBmaWxlbGlzdC5sZW5ndGg7XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9O1xuXG5cblxuXG5cbiAgICAgICAgLy8gLy92YXIgZCA9IG5ldyBEYXRlKClcbiAgICAgICAgLy8gdmFyIGQgPSAnbWpnJ1xuICAgICAgICAvLyB2YXIgZmlsZWxpc3QgPSAnSW4gdGhpcyBidWlsZDpcXG5cXG4nICsgZCArICdcXG5cXG4nO1xuICAgICAgICAvLyAvLyBMb29wIHRocm91Z2ggYWxsIGNvbXBpbGVkIGFzc2V0cyxcbiAgICAgICAgLy8gLy8gYWRkaW5nIGEgbmV3IGxpbmUgaXRlbSBmb3IgZWFjaCBmaWxlbmFtZS5cbiAgICAgICAgLy8gZm9yICh2YXIgZmlsZW5hbWUgaW4gY29tcGlsYXRpb24uYXNzZXRzKSB7XG4gICAgICAgIC8vICAgZmlsZWxpc3QgKz0gKCctICcrIGZpbGVuYW1lICsnXFxuJyk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gLy8gSW5zZXJ0IHRoaXMgbGlzdCBpbnRvIHRoZSB3ZWJwYWNrIGJ1aWxkIGFzIGEgbmV3IGZpbGUgYXNzZXQ6XG4gICAgICAgIC8vIGNvbXBpbGF0aW9uLmFzc2V0c1tkICsgJy5tZCddID0ge1xuICAgICAgICAvLyAgIHNvdXJjZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gZmlsZWxpc3Q7XG4gICAgICAgIC8vICAgfSxcbiAgICAgICAgLy8gICBzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBmaWxlbGlzdC5sZW5ndGg7XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9OyJdfQ==