const chalk = require('chalk');
const util = require('../util.js')

class watch {
  constructor(options) {
//    console.log(`${chalk.black("[INF] sencha-builder app watch")}`)
    util.senchaCmd(['app','watch']);
  }
}
module.exports = watch