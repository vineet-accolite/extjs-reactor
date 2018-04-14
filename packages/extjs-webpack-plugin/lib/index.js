'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _schemaUtils = require('schema-utils');

var _schemaUtils2 = _interopRequireDefault(_schemaUtils);

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _isGlob = require('is-glob');

var _isGlob2 = _interopRequireDefault(_isGlob);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var chalk = require('chalk');

//a comment

var readline = require('readline');

//const app = '\nℹ ｢ext｣: ExtJSWebpackPlugin: '
var app = chalk.green('ℹ ｢ext｣:') + ' ExtJSWebpackPlugin: ';

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

function hook_stdout(callback) {
  var old_write = process.stdout.write;
  console.log('in hook');
  process.stdout.write = function (write) {
    return function (string, encoding, fd) {
      write.apply(process.stdout, arguments);
      callback(string, encoding, fd);
    };
  }(process.stdout.write);

  return function () {
    process.stdout.write = old_write;
    console.log('in unhook');
  };
}

var ExtraWatchWebpackPlugin = function () {
  function ExtraWatchWebpackPlugin() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ExtraWatchWebpackPlugin);

    // this.unhook = hook_stdout(function(string, encoding, fd) {
    //   console.log('stdout: ' + string)
    // })
    process.stdout.cursorTo(0);
    console.log(app + 'constructor');
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
          //        console.log(readline)
          process.stdout.cursorTo(0);
          console.log(app + 'extjs-after-compile');

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
          //        this.unhook()
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjaGFsayIsInJlcXVpcmUiLCJyZWFkbGluZSIsImFwcCIsImdyZWVuIiwiZ2V0RmlsZUFuZENvbnRleHREZXBzIiwiY29tcGlsYXRpb24iLCJmaWxlcyIsImRpcnMiLCJjd2QiLCJmaWxlRGVwZW5kZW5jaWVzIiwiY29udGV4dERlcGVuZGVuY2llcyIsImlzV2VicGFjazQiLCJob29rcyIsImZkcyIsImNkcyIsImxlbmd0aCIsImZvckVhY2giLCJwYXR0ZXJuIiwiZiIsInN5bmMiLCJkb3QiLCJhYnNvbHV0ZSIsImNvbmNhdCIsImhvb2tfc3Rkb3V0IiwiY2FsbGJhY2siLCJvbGRfd3JpdGUiLCJwcm9jZXNzIiwic3Rkb3V0Iiwid3JpdGUiLCJjb25zb2xlIiwibG9nIiwic3RyaW5nIiwiZW5jb2RpbmciLCJmZCIsImFwcGx5IiwiYXJndW1lbnRzIiwiRXh0cmFXYXRjaFdlYnBhY2tQbHVnaW4iLCJvcHRpb25zIiwiY3Vyc29yVG8iLCJkZWZhdWx0cyIsImNvbXBpbGVyIiwiYWZ0ZXJDb21waWxlIiwidGFwIiwiZmlsZSIsImFkZCIsImNvbnRleHQiLCJwbHVnaW4iLCJjYiIsImVtaXQiLCJyZWN1cnNpdmVSZWFkU3luYyIsImVyciIsImVycm5vIiwiY3VycmVudE51bUZpbGVzIiwiZmlsZXNvdXJjZSIsImFzc2V0cyIsInNvdXJjZSIsInNpemUiLCJsYXN0TnVtRmlsZXMiLCJyZWZyZXNoIiwiZmlsZWxpc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBUkEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7O0FBRUE7O0FBT0EsSUFBSUMsV0FBV0QsUUFBUSxVQUFSLENBQWY7O0FBRUE7QUFDQSxJQUFNRSxNQUFTSCxNQUFNSSxLQUFOLENBQVksVUFBWixDQUFULDBCQUFOOztBQUdBLFNBQVNDLHFCQUFULENBQStCQyxXQUEvQixFQUE0Q0MsS0FBNUMsRUFBbURDLElBQW5ELEVBQXlEQyxHQUF6RCxFQUE4RDtBQUFBLE1BQ3BEQyxnQkFEb0QsR0FDVkosV0FEVSxDQUNwREksZ0JBRG9EO0FBQUEsTUFDbENDLG1CQURrQyxHQUNWTCxXQURVLENBQ2xDSyxtQkFEa0M7O0FBRTVELE1BQU1DLGFBQWFOLFlBQVlPLEtBQS9CO0FBQ0EsTUFBSUMsTUFBTUYsMENBQWlCRixnQkFBakIsS0FBcUNBLGdCQUEvQztBQUNBLE1BQUlLLE1BQU1ILDBDQUFpQkQsbUJBQWpCLEtBQXdDQSxtQkFBbEQ7QUFDQSxNQUFJSixNQUFNUyxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDcEJULFVBQU1VLE9BQU4sQ0FBYyxVQUFDQyxPQUFELEVBQWE7QUFDekIsVUFBSUMsSUFBSUQsT0FBUjtBQUNBLFVBQUksc0JBQU9BLE9BQVAsQ0FBSixFQUFxQjtBQUNuQkMsWUFBSSxlQUFLQyxJQUFMLENBQVVGLE9BQVYsRUFBbUI7QUFDckJULGtCQURxQjtBQUVyQlksZUFBSyxJQUZnQjtBQUdyQkMsb0JBQVU7QUFIVyxTQUFuQixDQUFKO0FBS0Q7QUFDRFIsWUFBTUEsSUFBSVMsTUFBSixDQUFXSixDQUFYLENBQU47QUFDRCxLQVZEO0FBV0FMLFVBQU0sc0JBQUtBLEdBQUwsQ0FBTjtBQUNEO0FBQ0QsTUFBSU4sS0FBS1EsTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ25CRCxVQUFNLHNCQUFLQSxJQUFJUSxNQUFKLENBQVdmLElBQVgsQ0FBTCxDQUFOO0FBQ0Q7QUFDRCxTQUFPO0FBQ0xFLHNCQUFrQkksR0FEYjtBQUVMSCx5QkFBcUJJO0FBRmhCLEdBQVA7QUFJRDs7QUFFRCxTQUFTUyxXQUFULENBQXFCQyxRQUFyQixFQUErQjtBQUM3QixNQUFJQyxZQUFZQyxRQUFRQyxNQUFSLENBQWVDLEtBQS9CO0FBQ0FDLFVBQVFDLEdBQVIsQ0FBWSxTQUFaO0FBQ0FKLFVBQVFDLE1BQVIsQ0FBZUMsS0FBZixHQUF3QixVQUFTQSxLQUFULEVBQWdCO0FBQ3BDLFdBQU8sVUFBU0csTUFBVCxFQUFpQkMsUUFBakIsRUFBMkJDLEVBQTNCLEVBQStCO0FBQ2xDTCxZQUFNTSxLQUFOLENBQVlSLFFBQVFDLE1BQXBCLEVBQTRCUSxTQUE1QjtBQUNBWCxlQUFTTyxNQUFULEVBQWlCQyxRQUFqQixFQUEyQkMsRUFBM0I7QUFDSCxLQUhEO0FBSUgsR0FMc0IsQ0FLcEJQLFFBQVFDLE1BQVIsQ0FBZUMsS0FMSyxDQUF2Qjs7QUFPQSxTQUFPLFlBQVc7QUFDZEYsWUFBUUMsTUFBUixDQUFlQyxLQUFmLEdBQXVCSCxTQUF2QjtBQUNBSSxZQUFRQyxHQUFSLENBQVksV0FBWjtBQUNELEdBSEg7QUFJRDs7SUFLb0JNLHVCO0FBT25CLHFDQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFDeEI7QUFDQTtBQUNBO0FBQ0FYLFlBQVFDLE1BQVIsQ0FBZVcsUUFBZixDQUF3QixDQUF4QjtBQUNBVCxZQUFRQyxHQUFSLENBQVk1QixNQUFNLGFBQWxCO0FBQ0EsK0JBQWdCRixRQUFRLGlCQUFSLENBQWhCLEVBQTRDcUMsT0FBNUMsRUFBcUQseUJBQXJELEVBTndCLENBTXlEO0FBQ2pGLFNBQUtBLE9BQUwsZ0JBQW9CRCx3QkFBd0JHLFFBQTVDLEVBQXlERixPQUF6RDtBQUNEOzs7OzBCQUVLRyxRLEVBQVU7QUFBQTs7QUFBQSxxQkFDUSxLQUFLSCxPQURiO0FBQUEsVUFDUi9CLEtBRFEsWUFDUkEsS0FEUTtBQUFBLFVBQ0RDLElBREMsWUFDREEsSUFEQztBQUFBLFVBRU5DLEdBRk0sR0FFRSxLQUFLNkIsT0FGUCxDQUVON0IsR0FGTTs7QUFHZEYsY0FBUSxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLEdBQTRCLENBQUNBLEtBQUQsQ0FBNUIsR0FBc0NBLEtBQTlDO0FBQ0FDLGFBQU8sT0FBT0EsSUFBUCxLQUFnQixRQUFoQixHQUEyQixDQUFDQSxJQUFELENBQTNCLEdBQW9DQSxJQUEzQzs7QUFFQSxVQUFJaUMsU0FBUzVCLEtBQWIsRUFBb0I7QUFDbEI0QixpQkFBUzVCLEtBQVQsQ0FBZTZCLFlBQWYsQ0FBNEJDLEdBQTVCLENBQWdDLHFCQUFoQyxFQUF1RCxVQUFDckMsV0FBRCxFQUFpQjtBQUM5RTtBQUNRcUIsa0JBQVFDLE1BQVIsQ0FBZVcsUUFBZixDQUF3QixDQUF4QjtBQUNBVCxrQkFBUUMsR0FBUixDQUFZNUIsTUFBTSxxQkFBbEI7O0FBSHNFLHNDQU9sRUUsc0JBQXNCQyxXQUF0QixFQUFtQ0MsS0FBbkMsRUFBMENDLElBQTFDLEVBQWdEQyxHQUFoRCxDQVBrRTtBQUFBLGNBS3BFQyxnQkFMb0UseUJBS3BFQSxnQkFMb0U7QUFBQSxjQU1wRUMsbUJBTm9FLHlCQU1wRUEsbUJBTm9FOztBQVF0RSxjQUFJSixNQUFNUyxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDcEJOLDZCQUFpQk8sT0FBakIsQ0FBeUIsVUFBQzJCLElBQUQsRUFBVTtBQUNqQ3RDLDBCQUFZSSxnQkFBWixDQUE2Qm1DLEdBQTdCLENBQWlDLG1CQUFRRCxJQUFSLENBQWpDO0FBQ0QsYUFGRDtBQUdEO0FBQ0QsY0FBSXBDLEtBQUtRLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUNuQkwsZ0NBQW9CTSxPQUFwQixDQUE0QixVQUFDNkIsT0FBRCxFQUFhO0FBQ3ZDeEMsMEJBQVlLLG1CQUFaLENBQWdDa0MsR0FBaEMsQ0FBb0NDLE9BQXBDO0FBQ0QsYUFGRDtBQUdEO0FBQ0YsU0FsQkQ7QUFtQkQsT0FwQkQsTUFvQk87QUFDTEwsaUJBQVNNLE1BQVQsQ0FBZ0IsZUFBaEIsRUFBaUMsVUFBQ3pDLFdBQUQsRUFBYzBDLEVBQWQsRUFBcUI7QUFDcERsQixrQkFBUUMsR0FBUixDQUFZNUIsTUFBTSxlQUFsQjs7QUFEb0QsdUNBS2hERSxzQkFBc0JDLFdBQXRCLEVBQW1DQyxLQUFuQyxFQUEwQ0MsSUFBMUMsRUFBZ0RDLEdBQWhELENBTGdEO0FBQUEsY0FHbERDLGdCQUhrRCwwQkFHbERBLGdCQUhrRDtBQUFBLGNBSWxEQyxtQkFKa0QsMEJBSWxEQSxtQkFKa0Q7O0FBTXBELGNBQUlKLE1BQU1TLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNwQlYsd0JBQVlJLGdCQUFaLEdBQStCQSxnQkFBL0IsQ0FEb0IsQ0FDNkI7QUFDbEQ7QUFDRCxjQUFJRixLQUFLUSxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDbkJWLHdCQUFZSyxtQkFBWixHQUFrQ0EsbUJBQWxDLENBRG1CLENBQ29DO0FBQ3hEO0FBQ0RxQztBQUNELFNBYkQ7QUFjRDs7QUFFRCxVQUFJUCxTQUFTNUIsS0FBYixFQUFvQjtBQUNsQjRCLGlCQUFTNUIsS0FBVCxDQUFlb0MsSUFBZixDQUFvQk4sR0FBcEIsQ0FBd0IsWUFBeEIsRUFBc0MsVUFBQ3JDLFdBQUQsRUFBaUI7QUFDckRxQixrQkFBUUMsTUFBUixDQUFlVyxRQUFmLENBQXdCLENBQXhCO0FBQ0FULGtCQUFRQyxHQUFSLENBQVk1QixNQUFNLFlBQWxCOztBQUVBLGNBQUkrQyxvQkFBb0JqRCxRQUFRLHdCQUFSLENBQXhCO0FBQ0EsY0FBSU0sS0FBSjs7QUFFQSxjQUFJO0FBQ0ZBLG9CQUFRMkMsa0JBQWtCLE9BQWxCLENBQVI7QUFDRCxXQUZELENBRUUsT0FBTUMsR0FBTixFQUFVO0FBQ1YsZ0JBQUdBLElBQUlDLEtBQUosS0FBYyxFQUFqQixFQUFvQjtBQUNsQnRCLHNCQUFRQyxHQUFSLENBQVkscUJBQVo7QUFDRCxhQUZELE1BRU87QUFDTDtBQUNBLG9CQUFNb0IsR0FBTjtBQUNEO0FBQ0Y7O0FBRUQsY0FBSUUsa0JBQWtCOUMsTUFBTVMsTUFBNUI7O0FBRUEsY0FBSXNDLGFBQWEsaUNBQWpCO0FBQ0FoRCxzQkFBWWlELE1BQVosQ0FBbUJGLGtCQUFrQixtQkFBckMsSUFBNEQ7QUFDMURHLG9CQUFRLGtCQUFXO0FBQUMscUJBQU9GLFVBQVA7QUFBa0IsYUFEb0I7QUFFMURHLGtCQUFNLGdCQUFXO0FBQUMscUJBQU9ILFdBQVd0QyxNQUFsQjtBQUF5QjtBQUZlLFdBQTVEOztBQUtBLGNBQUlxQyxtQkFBbUIsTUFBS0ssWUFBNUIsRUFBMEM7QUFDeEM7QUFDQTtBQUNBLGdCQUFJQyxVQUFVMUQsUUFBUSxzQ0FBUixDQUFkO0FBQ0E7QUFDQSxnQkFBSTBELE9BQUosQ0FBWSxFQUFaO0FBQ0QsV0FORCxNQU9LO0FBQ0g3QixvQkFBUUMsR0FBUixDQUFZNUIsTUFBTSxpREFBbEI7QUFDRDtBQUNELGdCQUFLdUQsWUFBTCxHQUFvQkwsZUFBcEI7QUFDUjtBQUNPLFNBdENEO0FBdUNELE9BeENELE1BeUNLO0FBQ0haLGlCQUFTTSxNQUFULENBQWdCLE1BQWhCLEVBQXdCLFVBQUN6QyxXQUFELEVBQWMwQyxFQUFkLEVBQXFCO0FBQzNDbEIsa0JBQVFDLEdBQVIsQ0FBWTVCLE1BQU0sTUFBbEI7QUFDQSxjQUFJeUQsV0FBVyxpQ0FBZjtBQUNBdEQsc0JBQVlpRCxNQUFaLENBQW1CLGNBQW5CLElBQXFDO0FBQ25DQyxvQkFBUSxrQkFBVztBQUFDLHFCQUFPSSxRQUFQO0FBQWdCLGFBREQ7QUFFbkNILGtCQUFNLGdCQUFXO0FBQUMscUJBQU9HLFNBQVM1QyxNQUFoQjtBQUF1QjtBQUZOLFdBQXJDO0FBSUEsY0FBSTJDLFVBQVUxRCxRQUFRLG1DQUFSLENBQWQ7QUFDQSxjQUFJMEQsT0FBSixDQUFZLEVBQVo7QUFDQVg7QUFDRCxTQVZEO0FBV0Q7QUFFRjs7Ozs7O0FBS0s7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQTlKYVgsdUIsQ0FDWkcsUSxHQUFXO0FBQ2hCL0IsT0FBS2tCLFFBQVFsQixHQUFSLEVBRFc7QUFFaEJGLFNBQU8sRUFGUztBQUdoQkMsUUFBTTtBQUhVLEM7a0JBREM2Qix1QiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcblxuLy9hIGNvbW1lbnRcbmltcG9ydCB2YWxpZGF0ZU9wdGlvbnMgZnJvbSAnc2NoZW1hLXV0aWxzJztcbmltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcbmltcG9ydCBpc0dsb2IgZnJvbSAnaXMtZ2xvYic7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG52YXIgcmVhZGxpbmUgPSByZXF1aXJlKCdyZWFkbGluZScpO1xuXG4vL2NvbnN0IGFwcCA9ICdcXG7ihLkg772iZXh0772jOiBFeHRKU1dlYnBhY2tQbHVnaW46ICdcbmNvbnN0IGFwcCA9IGAke2NoYWxrLmdyZWVuKCfihLkg772iZXh0772jOicpfSBFeHRKU1dlYnBhY2tQbHVnaW46IGA7XG5cblxuZnVuY3Rpb24gZ2V0RmlsZUFuZENvbnRleHREZXBzKGNvbXBpbGF0aW9uLCBmaWxlcywgZGlycywgY3dkKSB7XG4gIGNvbnN0IHsgZmlsZURlcGVuZGVuY2llcywgY29udGV4dERlcGVuZGVuY2llcyB9ID0gY29tcGlsYXRpb247XG4gIGNvbnN0IGlzV2VicGFjazQgPSBjb21waWxhdGlvbi5ob29rcztcbiAgbGV0IGZkcyA9IGlzV2VicGFjazQgPyBbLi4uZmlsZURlcGVuZGVuY2llc10gOiBmaWxlRGVwZW5kZW5jaWVzO1xuICBsZXQgY2RzID0gaXNXZWJwYWNrNCA/IFsuLi5jb250ZXh0RGVwZW5kZW5jaWVzXSA6IGNvbnRleHREZXBlbmRlbmNpZXM7XG4gIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgZmlsZXMuZm9yRWFjaCgocGF0dGVybikgPT4ge1xuICAgICAgbGV0IGYgPSBwYXR0ZXJuO1xuICAgICAgaWYgKGlzR2xvYihwYXR0ZXJuKSkge1xuICAgICAgICBmID0gZ2xvYi5zeW5jKHBhdHRlcm4sIHtcbiAgICAgICAgICBjd2QsXG4gICAgICAgICAgZG90OiB0cnVlLFxuICAgICAgICAgIGFic29sdXRlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGZkcyA9IGZkcy5jb25jYXQoZik7XG4gICAgfSk7XG4gICAgZmRzID0gdW5pcShmZHMpO1xuICB9XG4gIGlmIChkaXJzLmxlbmd0aCA+IDApIHtcbiAgICBjZHMgPSB1bmlxKGNkcy5jb25jYXQoZGlycykpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZmlsZURlcGVuZGVuY2llczogZmRzLFxuICAgIGNvbnRleHREZXBlbmRlbmNpZXM6IGNkcyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaG9va19zdGRvdXQoY2FsbGJhY2spIHtcbiAgdmFyIG9sZF93cml0ZSA9IHByb2Nlc3Muc3Rkb3V0LndyaXRlXG4gIGNvbnNvbGUubG9nKCdpbiBob29rJylcbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgPSAoZnVuY3Rpb24od3JpdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcsIGVuY29kaW5nLCBmZCkge1xuICAgICAgICAgIHdyaXRlLmFwcGx5KHByb2Nlc3Muc3Rkb3V0LCBhcmd1bWVudHMpXG4gICAgICAgICAgY2FsbGJhY2soc3RyaW5nLCBlbmNvZGluZywgZmQpXG4gICAgICB9XG4gIH0pKHByb2Nlc3Muc3Rkb3V0LndyaXRlKVxuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlID0gb2xkX3dyaXRlXG4gICAgICBjb25zb2xlLmxvZygnaW4gdW5ob29rJylcbiAgICB9XG59XG5cblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4dHJhV2F0Y2hXZWJwYWNrUGx1Z2luIHtcbiAgc3RhdGljIGRlZmF1bHRzID0ge1xuICAgIGN3ZDogcHJvY2Vzcy5jd2QoKSxcbiAgICBmaWxlczogW10sXG4gICAgZGlyczogW10sXG4gIH07XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gdGhpcy51bmhvb2sgPSBob29rX3N0ZG91dChmdW5jdGlvbihzdHJpbmcsIGVuY29kaW5nLCBmZCkge1xuICAgIC8vICAgY29uc29sZS5sb2coJ3N0ZG91dDogJyArIHN0cmluZylcbiAgICAvLyB9KVxuICAgIHByb2Nlc3Muc3Rkb3V0LmN1cnNvclRvKDApXG4gICAgY29uc29sZS5sb2coYXBwICsgJ2NvbnN0cnVjdG9yJylcbiAgICB2YWxpZGF0ZU9wdGlvbnMocmVxdWlyZSgnLi4vb3B0aW9ucy5qc29uJyksIG9wdGlvbnMsICdFeHRyYVdhdGNoV2VicGFja1BsdWdpbicpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgdGhpcy5vcHRpb25zID0geyAuLi5FeHRyYVdhdGNoV2VicGFja1BsdWdpbi5kZWZhdWx0cywgLi4ub3B0aW9ucyB9O1xuICB9XG5cbiAgYXBwbHkoY29tcGlsZXIpIHtcbiAgICBsZXQgeyBmaWxlcywgZGlycyB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHsgY3dkIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgZmlsZXMgPSB0eXBlb2YgZmlsZXMgPT09ICdzdHJpbmcnID8gW2ZpbGVzXSA6IGZpbGVzO1xuICAgIGRpcnMgPSB0eXBlb2YgZGlycyA9PT0gJ3N0cmluZycgPyBbZGlyc10gOiBkaXJzO1xuXG4gICAgaWYgKGNvbXBpbGVyLmhvb2tzKSB7XG4gICAgICBjb21waWxlci5ob29rcy5hZnRlckNvbXBpbGUudGFwKCdleHRqcy1hZnRlci1jb21waWxlJywgKGNvbXBpbGF0aW9uKSA9PiB7XG4vLyAgICAgICAgY29uc29sZS5sb2cocmVhZGxpbmUpXG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LmN1cnNvclRvKDApXG4gICAgICAgIGNvbnNvbGUubG9nKGFwcCArICdleHRqcy1hZnRlci1jb21waWxlJylcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGZpbGVEZXBlbmRlbmNpZXMsXG4gICAgICAgICAgY29udGV4dERlcGVuZGVuY2llcyxcbiAgICAgICAgfSA9IGdldEZpbGVBbmRDb250ZXh0RGVwcyhjb21waWxhdGlvbiwgZmlsZXMsIGRpcnMsIGN3ZCk7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmlsZURlcGVuZGVuY2llcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgICAgICBjb21waWxhdGlvbi5maWxlRGVwZW5kZW5jaWVzLmFkZChyZXNvbHZlKGZpbGUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29udGV4dERlcGVuZGVuY2llcy5mb3JFYWNoKChjb250ZXh0KSA9PiB7XG4gICAgICAgICAgICBjb21waWxhdGlvbi5jb250ZXh0RGVwZW5kZW5jaWVzLmFkZChjb250ZXh0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBpbGVyLnBsdWdpbignYWZ0ZXItY29tcGlsZScsIChjb21waWxhdGlvbiwgY2IpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYXBwICsgJ2FmdGVyLWNvbXBpbGUnKVxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgZmlsZURlcGVuZGVuY2llcyxcbiAgICAgICAgICBjb250ZXh0RGVwZW5kZW5jaWVzLFxuICAgICAgICB9ID0gZ2V0RmlsZUFuZENvbnRleHREZXBzKGNvbXBpbGF0aW9uLCBmaWxlcywgZGlycywgY3dkKTtcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb21waWxhdGlvbi5maWxlRGVwZW5kZW5jaWVzID0gZmlsZURlcGVuZGVuY2llczsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICB9XG4gICAgICAgIGlmIChkaXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb21waWxhdGlvbi5jb250ZXh0RGVwZW5kZW5jaWVzID0gY29udGV4dERlcGVuZGVuY2llczsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICB9XG4gICAgICAgIGNiKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjb21waWxlci5ob29rcykge1xuICAgICAgY29tcGlsZXIuaG9va3MuZW1pdC50YXAoJ2V4dGpzLWVtaXQnLCAoY29tcGlsYXRpb24pID0+IHtcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQuY3Vyc29yVG8oMClcbiAgICAgICAgY29uc29sZS5sb2coYXBwICsgJ2V4dGpzLWVtaXQnKVxuXG4gICAgICAgIHZhciByZWN1cnNpdmVSZWFkU3luYyA9IHJlcXVpcmUoJ3JlY3Vyc2l2ZS1yZWFkZGlyLXN5bmMnKVxuICAgICAgICB2YXIgZmlsZXNcbiAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWxlcyA9IHJlY3Vyc2l2ZVJlYWRTeW5jKCcuL2FwcCcpO1xuICAgICAgICB9IGNhdGNoKGVycil7XG4gICAgICAgICAgaWYoZXJyLmVycm5vID09PSAzNCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGF0aCBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL3NvbWV0aGluZyB1bnJlbGF0ZWQgd2VudCB3cm9uZywgcmV0aHJvdyBcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3VycmVudE51bUZpbGVzID0gZmlsZXMubGVuZ3RoXG4gXG4gICAgICAgIHZhciBmaWxlc291cmNlID0gJ3RoaXMgZmlsZSBlbmFibGVzIGNsaWVudCByZWxvYWQnXG4gICAgICAgIGNvbXBpbGF0aW9uLmFzc2V0c1tjdXJyZW50TnVtRmlsZXMgKyAnRmlsZXNGb3JSZWxvYWQubWQnXSA9IHtcbiAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uKCkge3JldHVybiBmaWxlc291cmNlfSxcbiAgICAgICAgICBzaXplOiBmdW5jdGlvbigpIHtyZXR1cm4gZmlsZXNvdXJjZS5sZW5ndGh9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudE51bUZpbGVzICE9IHRoaXMubGFzdE51bUZpbGVzKSB7XG4gICAgICAgICAgLy92YXIgYnVpbGQgPSByZXF1aXJlKCdAZXh0anMvc2VuY2hhLWJ1aWxkZXIvYXBwL2J1aWxkLmpzJylcbiAgICAgICAgICAvL25ldyBidWlsZCh7fSlcbiAgICAgICAgICB2YXIgcmVmcmVzaCA9IHJlcXVpcmUoJ0BleHRqcy9zZW5jaGEtYnVpbGRlci9hcHAvcmVmcmVzaC5qcycpXG4gICAgICAgICAgLy92YXIgcmVmcmVzaCA9IHJlcXVpcmUoJ0BleHRqcy9zZW5jaGEtYnVpbGRlci9yZWZyZXNoJylcbiAgICAgICAgICBuZXcgcmVmcmVzaCh7fSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhhcHAgKyAnQ2FsbCB0byBTZW5jaGEgQnVpbGRlciBub3QgbmVlZGVkLCBubyBuZXcgZmlsZXMnKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdE51bUZpbGVzID0gY3VycmVudE51bUZpbGVzXG4vLyAgICAgICAgdGhpcy51bmhvb2soKVxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb21waWxlci5wbHVnaW4oJ2VtaXQnLCAoY29tcGlsYXRpb24sIGNiKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFwcCArICdlbWl0JylcbiAgICAgICAgdmFyIGZpbGVsaXN0ID0gJ3RoaXMgZmlsZSBlbmFibGVzIGNsaWVudCByZWxvYWQnXG4gICAgICAgIGNvbXBpbGF0aW9uLmFzc2V0c1snRm9yUmVsb2FkLm1kJ10gPSB7XG4gICAgICAgICAgc291cmNlOiBmdW5jdGlvbigpIHtyZXR1cm4gZmlsZWxpc3R9LFxuICAgICAgICAgIHNpemU6IGZ1bmN0aW9uKCkge3JldHVybiBmaWxlbGlzdC5sZW5ndGh9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlZnJlc2ggPSByZXF1aXJlKCdAZXh0anMvc2VuY2hhLW5vZGUvYXBwL3JlZnJlc2guanMnKVxuICAgICAgICBuZXcgcmVmcmVzaCh7fSlcbiAgICAgICAgY2IoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgfVxufVxuXG5cblxuICAgICAgICAvLyB2YXIgZmlsZWxpc3QgPSAnSW4gdGhpcyBidWlsZDpcXG5cXG4nO1xuXG4gICAgICAgIC8vIC8vIExvb3AgdGhyb3VnaCBhbGwgY29tcGlsZWQgYXNzZXRzLFxuICAgICAgICAvLyAvLyBhZGRpbmcgYSBuZXcgbGluZSBpdGVtIGZvciBlYWNoIGZpbGVuYW1lLlxuICAgICAgICAvLyBmb3IgKHZhciBmaWxlbmFtZSBpbiBjb21waWxhdGlvbi5hc3NldHMpIHtcbiAgICAgICAgLy8gICBmaWxlbGlzdCArPSAoJy0gJysgZmlsZW5hbWUgKydcXG4nKTtcbiAgICAgICAgLy8gfVxuICAgIFxuICAgICAgICAvLyAvLyBJbnNlcnQgdGhpcyBsaXN0IGludG8gdGhlIHdlYnBhY2sgYnVpbGQgYXMgYSBuZXcgZmlsZSBhc3NldDpcbiAgICAgICAgLy8gY29tcGlsYXRpb24uYXNzZXRzWydmaWxlbGlzdC5tZCddID0ge1xuICAgICAgICAvLyAgIHNvdXJjZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gZmlsZWxpc3Q7XG4gICAgICAgIC8vICAgfSxcbiAgICAgICAgLy8gICBzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBmaWxlbGlzdC5sZW5ndGg7XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9O1xuXG5cblxuXG5cbiAgICAgICAgLy8gLy92YXIgZCA9IG5ldyBEYXRlKClcbiAgICAgICAgLy8gdmFyIGQgPSAnbWpnJ1xuICAgICAgICAvLyB2YXIgZmlsZWxpc3QgPSAnSW4gdGhpcyBidWlsZDpcXG5cXG4nICsgZCArICdcXG5cXG4nO1xuICAgICAgICAvLyAvLyBMb29wIHRocm91Z2ggYWxsIGNvbXBpbGVkIGFzc2V0cyxcbiAgICAgICAgLy8gLy8gYWRkaW5nIGEgbmV3IGxpbmUgaXRlbSBmb3IgZWFjaCBmaWxlbmFtZS5cbiAgICAgICAgLy8gZm9yICh2YXIgZmlsZW5hbWUgaW4gY29tcGlsYXRpb24uYXNzZXRzKSB7XG4gICAgICAgIC8vICAgZmlsZWxpc3QgKz0gKCctICcrIGZpbGVuYW1lICsnXFxuJyk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gLy8gSW5zZXJ0IHRoaXMgbGlzdCBpbnRvIHRoZSB3ZWJwYWNrIGJ1aWxkIGFzIGEgbmV3IGZpbGUgYXNzZXQ6XG4gICAgICAgIC8vIGNvbXBpbGF0aW9uLmFzc2V0c1tkICsgJy5tZCddID0ge1xuICAgICAgICAvLyAgIHNvdXJjZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gZmlsZWxpc3Q7XG4gICAgICAgIC8vICAgfSxcbiAgICAgICAgLy8gICBzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBmaWxlbGlzdC5sZW5ndGg7XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9OyJdfQ==