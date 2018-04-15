#!/usr/bin/env node
const Generator = require('yeoman-generator')
const chalk = require('chalk');
//const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { kebabCase, pick } = require('lodash')

require('./XTemplate/js/Ext.js');
require('./XTemplate/js/String.js');
require('./XTemplate/js/Format.js');
require('./XTemplate/js/Template.js');
require('./XTemplate/js/XTemplateParser.js');
require('./XTemplate/js/XTemplateCompiler.js');
require('./XTemplate/js/XTemplate.js');

var config = {}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    var data = fs.readFileSync(path.resolve(__dirname) + '/config.json')
    config = JSON.parse(data);
    this.log(`
    ${chalk.bold.green.underline('Welcome to Sencha Creator - the Ext JS Application Creator')}
    `)
    //    Instructions here about using ${chalk.green('Templates')}

  }

  prompting_defaults() {
    return this.prompt([
      {
        type: 'confirm',
        name: 'usedefaults',
        message: 'Would you like to use defaults from config.json?',
        default: config.usedefaults
      }
    ]).then(props => Object.assign(this, props));
  }

  prompting_name() {
    if (this.usedefaults == true ) { 

      console.log('\n' + chalk.green.bold.underline('App Defaults (cannot easily be changed)'))
      console.log(chalk.green('appName: ') + config.appName)
      console.log(chalk.green('templateType: ') + config.templateType)
      console.log(chalk.green('template: ') + config.template)
      console.log(chalk.green('templateFolderName: ') + config.templateFolderName)

      console.log('\n' + chalk.green.bold.underline('Package.json Defaults (can be changed later)'))
      console.log(chalk.green('packageName: ') + config.packageName)
      console.log(chalk.green('version: ') + config.version)
      console.log(chalk.green('description: ') + config.description)
      console.log(chalk.green('gitRepositoryURL: ') + config.gitRepositoryURL)
      console.log(chalk.green('keywords: ') + config.keywords)
      console.log(chalk.green('author: ') + config.author)
      console.log(chalk.green('license: ') + config.license)
      console.log(chalk.green('bugsURL: ') + config.bugsURL)
      console.log(chalk.green('homepageURL: ') + config.homepageURL)
      console.log('\n')

      // this.templateType = config.templateType
      // this.templateFolderName = ''
      // this.template = config.template

      // this.appName = config.appName
      // this.packageName = config.packageName
      // this.version = config.version
      // this.gitRepositoryURL = config.gitRepositoryURL
      // this.keywords = config.keywords
      // this.author = config.author
      // this.license = config.license
      // this.bugsURL = config.bugsURL
      // this.homepageURL = config.homepageURL
      // this.description = config.description





      this.skip = true 
    }
    else {
      this.skip = false
    }
    if (this.skip == true ) { return }

    return this.prompt([{
      type: 'input',
      name: 'appName',
      message: 'What would you like to name your Ext JS app?',
      default: config.appName
    }]).then(props => Object.assign(this, props));
  }

  prompting_templateType() {
    if (this.skip == true ) { return }

    const prompts = [
      {
        type: 'list',
        message: 'What type of Template do want?',
        name: 'templateType',
        choices: ['make a selection from a list','type a folder name']
      }
    ] 
    return this.prompt(prompts).then(props => Object.assign(this, props))
  }

  prompting_template() {
    if (this.skip == true ) { return }

    var prompts = []
    if (this.templateType === 'type a folder name') {
      prompts = [ 
        {
          type: 'input',
          message: 'What is the Template folder name?',
          name: 'templateFolderName',
          default: config.templateFolderName
        }
      ]
    }
    else {
      prompts = [ 
        {
          type: 'list',
          name: 'template',
          message: 'What Template would you like to use?',
          choices: ['universalmodern', 'moderndesktop', 'classicdesktop']
        }
      ]
    }
    return this.prompt(prompts).then(props => Object.assign(this, props))
  }

  prompting_choices() {
    if (this.skip == true ) { return }

    const prompts = [
      {
        type: 'input',
        name: 'packageName',
        message: 'What would you like to name the NPM Package?',
        default: kebabCase(this.appName)
      },
      {
        type: 'input',
        message: 'What NPM version is this?',
        name: 'version',
        default: config.version
      }, 
      {
        type: 'input',
        message: 'What is the GIT repository URL?',
        name: 'gitRepositoryURL',
        default: config.gitRepositoryURL
      }, 
      {
        type: 'input',
        message: 'What are the NPM keywords?',
        name: 'keywords',
        default: config.keywords
      }, 
      {
        type: 'input',
        message: `What is the Author's Name?`,
        name: 'author',
        default: config.author
      }, 
      {
        type: 'input',
        message: 'What type of License does this project need?',
        name: 'license',
        default: config.license
      },
      {
        type: 'input',
        message: 'What is the URL to submit bugsURL?',
        name: 'bugsURL',
        default: config.bugsURL
      },
      {
        type: 'input',
        message: 'What is the Home Page URL?',
        name: 'homepageURL',
        default: config.homepageURL
      }
    ];
    return this.prompt(prompts).then(props => Object.assign(this, props));
  }

  prompting_desc() {
    if (this.skip == true ) { return }

    const prompts = [
      {
        type: 'input',
        message: 'What is the NPM Package Description?',
        name: 'description',
        default: this.packageName + ' description for Ext JS app ' + this.appName,
      }
    ] 
    return this.prompt(prompts).then(props => Object.assign(this, props))
  }

  prompting_create() {
    if(this.skip == true) {

      this.templateType = config.templateType
      this.templateFolderName = ''
      this.template = config.template

      this.appName = config.appName
      this.packageName = config.packageName
      this.version = config.version
      this.gitRepositoryURL = config.gitRepositoryURL
      this.keywords = config.keywords
      this.author = config.author
      this.license = config.license
      this.bugsURL = config.bugsURL
      this.homepageURL = config.homepageURL
      this.description = config.description
    }

    this.bad = false
    if (this.template == undefined) {
      if (!fs.existsSync(this.templateFolderName)){
        this.bad = true
        this.template = 'folder'
        console.log('Error, Template folder does not exist')
        return
      }
    }

    const prompts = [
      {
        type: 'confirm',
        name: 'createnow',
        message: 'Would you like to create the Ext JS app now?',
        default: config.createnow
      }
    ] 
    return this.prompt(prompts).then(props => Object.assign(this, props))
  }

  writing() {
    if (this.createnow == false ) { 
      this.log(`
    ${chalk.red('Create has been cancelled')}
      `)
      this.bad = true 
    }
    if (this.bad == true ) { return }

    if (this.template == undefined) {this.template = 'folder'}

    var destDir = process.cwd() + '/' + this.packageName
    if (fs.existsSync(destDir)){
      console.log(`${chalk.red('Error: folder ' + destDir + ' exists')}`)
      this.bad = true 
      return
    }

    this.destinationRoot(this.packageName)
                                                                                                                                                                                                              

    // const packageInfo = {};
    // Object.assign(packageInfo, {
    //   name: this.packageName
    // });
    // if (this.version) packageInfo.version = this.version;
    // if (this.description) packageInfo.description = this.description;
    // packageInfo.scripts = {
    //   "start": "webpack-dev-server --progress",
    //   "build": "NODE_ENV=production webpack --env.prod=true"
    // }
    // if (this.gitRepositoryURL) {
    //   packageInfo.repository = {
    //     type: 'git',
    //     url: this.gitRepositoryURL
    //   }
    // }
    // if (this.keywords) {
    //   packageInfo.keywords = this.keywords
    // }
    // if (this.author) packageInfo.author = this.author;
    // if (this.license) packageInfo.license = this.license;
    // if (this.bugsURL) {
    //   packageInfo.bugsURL = {
    //     url: this.bugsURL
    //   }
    // }
    // if (this.homepageURL) packageInfo.homepageURL = this.homepageURL;
    // packageInfo.dependencies = {
    //   "@extjs/ext-react": "^6.5.3",
    //   "babel-polyfill": "^6.26.0",
    //   "babel-runtime": "^6.26.0"
    // }
    // packageInfo.devDependencies = {
    //   "@extjs/extjs-webpack-plugin": "^2.0.0",
    //   "babel-preset-env": "^1.6.1",
    //   "react": "^16.3.1",
    //   "react-dom": "^16.3.1",
    //   "react-hot-loader": "^4.0.1",
    //   "babel-core": "^6.26.0",
    //   "babel-jest": "^22.4.3",
    //   "babel-loader": "^7.1.4",
    //   "babel-plugin-transform-runtime": "^6.23.0",
    //   "babel-preset-es2015": "^6.14.1",
    //   "babel-preset-react": "^6.24.1",
    //   "babel-preset-stage-2": "^6.24.1",
    //   "webpack": "^4.5.0",
    //   "webpack-cli": "^2.0.14",
    //   "webpack-dev-server": "^3.1.3",
    //   "html-webpack-plugin": "^3.2.0",
    //   "open-browser-webpack-plugin": "0.0.5",
    //   "webpack-shell-plugin": "^0.5.0"
    // }
    // this.fs.writeJSON('package.json', packageInfo, null, '  ');

    var CurrWorkingDir = process.cwd()
    var values = {
      appName: this.appName,
      packageName: this.packageName
    }

    var file = path.resolve(__dirname) + '/templates/package.json.tpl.default'
    var content = fs.readFileSync(file).toString()
//    if (file.substr(file.length - 11) == 'tpl.default') { 
      var tpl = new Ext.XTemplate(content)
      var t = tpl.apply(values)
      tpl = null
      fs.writeFileSync(CurrWorkingDir + '/package.json', t);
//    }

    var file = path.resolve(__dirname) + '/templates/webpack.config.js.tpl.default'
    var content = fs.readFileSync(file).toString()
//    if (file.substr(file.length - 11) == 'tpl.default') { 
      var tpl = new Ext.XTemplate(content)
      var t = tpl.apply(values)
      tpl = null
      fs.writeFileSync(CurrWorkingDir + '/webpack.config.js', t);
//    }
  }

  install() {
    if (this.bad == true) { return }

    var app = require('@extjs/sencha-build/generate/app.js')
    var options = { 
      parms: [ 'gen', 'app', this.appName, './' ],
      sdk: path.resolve(__dirname) + '/../node_modules/@extjs/ext-react',
      template: this.template,
      templateFull: this.templateFolderName,
      force: false 
    }
    new app(options)

    // this.installDependencies({
    //   bower: false,
    //   npm: true,
    //   skipMessage: true
    // }).then(() => 
    //   {
    //     console.log(chalk.green('[INF]')+ ' NPM Install completed')
    //   }
    // )
    
  }

  end() {
    if (this.bad == true) { return }

    this.log(`
${chalk.green.underline('Your new Ext JS Application is ready!')}

cd ${this.packageName} then "npm install / npm start" to run the development build and open your new application in a web browser.
`)
  }
}


          //let sencha = _getSenchCmdPath();
          //var args = ['--sdk', 'node_modules/@extjs/ext-react', 'generate', 'app', '--template', this.template, this.appName, './']
          //spawnSync('sn',args, {stdio: 'inherit',cwd: output, silent: false});


  //   var data = fs.readFileSync(path.resolve(__dirname) + '/config.json')
  //   //var myObj
    
  //   try {
  //     this.config = JSON.parse(data);
  //     //console.dir(this.config);
  //   }
  //   catch (err) {
  //     console.log('There has been an error parsing your JSON.')
  //     console.log(err);
  //   }




  //   // var myOptions = {
  //   //   name: 'Avian',
  //   //   dessert: 'cake',
  //   //   flavor: 'chocolate',
  //   //   beverage: 'coffee'
  //   // };
  
  //   // var data = JSON.stringify(myOptions);
  
  //   // fs.writeFile( path.resolve(__dirname) + '/config.json', data, function (err) {
  //   //   if (err) {
  //   //     console.log('There has been an error saving your configuration data.');
  //   //     console.log(err.message);
  //   //     return;
  //   //   }
  //   //   console.log('Configuration saved successfully.')

  //   //   var data = fs.readFileSync(path.resolve(__dirname) + '/config.json')
  //   //   var myObj
      
  //   //   try {
  //   //     myObj = JSON.parse(data);
  //   //     console.dir(myObj);
  //   //   }
  //   //   catch (err) {
  //   //     console.log('There has been an error parsing your JSON.')
  //   //     console.log(err);
  //   //   }


  //   // });