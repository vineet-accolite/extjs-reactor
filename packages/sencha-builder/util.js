var chalk = require('chalk');
var fs = require('fs-extra')
var json = require('comment-json');
const sencha = require('@extjs/sencha-cmd')

//exports.err = function err(s) { return chalk.red('[ERR] ') + s }
//exports.inf = function inf(s) { return chalk.green('[INF] ') + s }
//exports.wrn = function err(s) { return chalk.yellow('[WRN] ') + s }
exports.errLog = function err(s) { console.log(chalk.red('[ERR] ') + s) }
exports.infLog = function inf(s) { console.log(chalk.green('[INF] ') + s) }
exports.wrnLog = function err(s) { console.log(chalk.yellow('[WRN] ') + s) }
//exports.dbgLog = function dbgLog(s) { if (debug) console.log(chalk.blue('[DBG] ') + s) }
exports.dbgLog = function dbgLog(s) {  }
exports.err = function err(s) { return chalk.red('[ERR] ') + s }
exports.inf = function inf(s) { return chalk.green('[INF] ') + s }
exports.wrn = function err(s) { return chalk.yellow('[WRN] ') + s }
exports.dbg = function err(s) { return chalk.blue('[DBG] ') + s }

var errThrow = function err(s) { throw chalk.red('[ERR] ') + s }
exports.errThrow = errThrow
exports.dbgThrow = function err(s) { throw chalk.blue('[ERR] ') + s }

exports.senchaCmd = (parms) => {
  const spawnSync = require('child_process').spawnSync
  process.stdout.cursorTo(0)
  console.log(`${chalk.green('ℹ ｢ext｣:')} Sencha Builder started`);
  spawnSync(sencha, parms, { stdio: 'inherit', encoding: 'utf-8'})
  //const child = spawnSync(sencha, parms)
  //console.log('x'+child.stderr.toString()+'x'); 
  process.stdout.cursorTo(0)
  console.log(`${chalk.green('ℹ ｢ext｣:')} Sencha Builder completed`);
}


  // var intercept = require("intercept-stdout");
 
  // var unhook_intercept = intercept(function(txt) {
  //   return str.slice(0, -1);
  //   //return txt.replace( 'INF' , 'that' );
  // });
   
  // console.log("/n/nINF text is being modified");
  // // -> that text is being modified 

  // var stream = require('stream');
  // var grabber = new stream.Writable();
  
  // grabber._write = function(chunk, enc, done) {
  //     console.log('Chunk:');
  //     console.log(String(chunk));
  //     done();
  // };




  //console.log(child.stdout.toString());
  //console.log(child.stderr.toString()); 

//   child.on('exit', function (code, signal) {
//     console.log(`child process exited with code ${code} and signal ${signal}`);
//   });
//   child.stdout.on('data', (data) => {
// //    var substrings = ['[ERR]', '[WRN]', '[INF] Processing', "[INF] Server", "[INF] Writing content", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"]
// //    if (substrings.some(function(v) { return data.indexOf(v) >= 0; })) { 
//       var str = data.toString()
//       var s = str.replace(/\r?\n|\r/g, " ")
//       console.log(`${s}`) 
// //    }
//   });
//   child.stderr.on('data', (data) => {
//     var str = data.toString()
//     var s = str.replace(/\r?\n|\r/g, " ")
//     console.log(`${chalk.red("[ERR]")} ${s}`) 
//   });
//   return child;


//   const sync = require('child_process').spawnSync
//   const { spawn } = require('child_process')



//   child.on('exit', function (code, signal) {
//     console.log(`child process exited with code ${code} and signal ${signal}`);
//   });
//   child.stdout.on('data', (data) => {
// //    var substrings = ['[ERR]', '[WRN]', '[INF] Processing', "[INF] Server", "[INF] Writing content", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"]
// //    if (substrings.some(function(v) { return data.indexOf(v) >= 0; })) { 
//       var str = data.toString()
//       var s = str.replace(/\r?\n|\r/g, " ")
//       console.log(`${s}`) 
// //    }
//   });
//   child.stderr.on('data', (data) => {
//     var str = data.toString()
//     var s = str.replace(/\r?\n|\r/g, " ")
//     console.log(`${chalk.red("[ERR]")} ${s}`) 
//   });
//   return child;






exports.getAppName = function getAppName(CurrWorkingDir) {
	var appJsonFileName = getAppJson(CurrWorkingDir)
	if (appJsonFileName == '') {
		throw 'Not a Sencha Cmd project - no app.json found'
	}
	var objAppJson = json.parse(fs.readFileSync(appJsonFileName).toString());
	var appName = objAppJson.name
	return appName
}



function getAppJson(CurrWorkingDir) {
	var myStringArray = CurrWorkingDir.split('/')
	var arrayLength = myStringArray.length
	var appJsonFile = ''
	for (var j = arrayLength; j > 0; j--) {
		var dir = ''
		for (var i = 0; i < j; i++) {
			if (myStringArray[i]!='') {
				dir = dir + '/' + myStringArray[i]
			}
		}
		// var workspaceJson = dir + '/' + 'workspace.json'
		// if (fs.existsSync(workspaceJson)) {
		// 	console.log('yes ' + workspaceJson)
		// }
		var appJson = dir + '/' + 'app.json'
//		console.log(appJson)
		if (fs.existsSync(appJson)) {
//			console.log('here')
			appJsonFile = appJson
		}
	}
	return appJsonFile
}

exports.getSenchaCmdPath = function getSenchaCmdPath(toPath, path) {
	pathVar = process.env.PATH
	var myStringArray = pathVar.split(':')
	var arrayLength = myStringArray.length
	var pathSenchaCmd = ''
	for (var i = 0; i < arrayLength; i++) {
		var str = myStringArray[i]
		var n = str.indexOf("Sencha/Cmd");
		if (n != -1) {
			pathSenchaCmd = str
		}
	}
	//var other = '/plugins/ext/current'
	//console.log(pathSenchaCmd + other)
	return pathSenchaCmd
}






exports.handleOutput = (child) => {
  child.on('exit', function (code, signal) {
    console.log(`child process exited with code ${code} and signal ${signal}`);
  });
  child.stdout.on('data', (data) => {
    var substrings = ['[ERR]', '[WRN]', '[INF] Processing', "[INF] Server", "[INF] Writing content", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"]
    if (substrings.some(function(v) { return data.indexOf(v) >= 0; })) { 
      var str = data.toString()
      var s = str.replace(/\r?\n|\r/g, " ")
      console.log(`${s}`) 
    }
  });
  child.stderr.on('data', (data) => {
    console.error(`E:${data}`);
  });
  return child;
}







//   return new Promise(function(resolve, reject) {
//     const { spawn } = require('child_process')

//     console.log(`\n\n invoking Sencha Builder...`);
//     const child = spawn(sencha, parms)
// //    console.log('x'+child.stderr.toString()+'x'); 
// //    console.log(`\n ...Sencha Builder completed\n\n`);

//     child.on('exit', function (code, signal) {
//       console.log(`child process exited with code ${code} and signal ${signal}`);
//       resolve({code:code,signal:signal});
//     });
//     child.stdout.on('data', (data) => {
//   //    var substrings = ['[ERR]', '[WRN]', '[INF] Processing', "[INF] Server", "[INF] Writing content", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"]
//   //    if (substrings.some(function(v) { return data.indexOf(v) >= 0; })) { 
//         var str = data.toString()
//         var s = str.replace(/\r?\n|\r/g, " ")
//         console.log(`${s}`) 
//   //    }
//     });
//     child.stderr.on('data', (data) => {
//       var str = data.toString()
//       var s = str.replace(/\r?\n|\r/g, " ")
//       console.log(`${chalk.red("[ERR]")} ${s}`) 
//     });
// //reject(err);