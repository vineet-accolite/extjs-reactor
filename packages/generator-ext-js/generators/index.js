#!/usr/bin/env node
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { kebabCase, pick } = require('lodash')
var config = {}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    var data = fs.readFileSync(path.resolve(__dirname) + '/config.json')
    config = JSON.parse(data);
    this.log(`
    ${chalk.bold.underline('Welcome to the Ext JS app generator')}

    Instructions here about using ${chalk.green('Templates')}
    `)
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
    this.skip = false
    if (this.usedefaults == true ) { 
      this.log(`
    ${chalk.green('Using Defaults from config.json')}
      `)
      this.skip = true 
    }
    if (this.skip == true ) { return }

    return this.prompt([{
      type: 'input',
      name: 'appName',
      message: 'What would you like to name your Ext JS app?',
      default: config.appName
    }]).then(props => Object.assign(this, props));
  }

  prompting_templatetype() {
    
    const prompts = [
      {
        type: 'list',
        message: 'What type of Template do want?',
        name: 'templatetype',
        choices: ['make a selection from a list','type a folder name']
      }
    ] 
    return this.prompt(prompts).then(props => Object.assign(this, props))
  }

  prompting_template() {

    var prompts = []
    if (this.templatetype === 'type a folder name') {
      prompts = [ 
        {
          type: 'input',
          message: 'What is the Template folder name?',
          name: 'templatefoldername',
          default: config.templatefoldername
        }
      ]
    }
    else {
      prompts = [ 
        {
          type: 'list',
          name: 'template',
          message: 'What Template would you like to use?',
          choices: ['universalmodern', 'moderndesktop']
        }
      ]
    }
    return this.prompt(prompts).then(props => Object.assign(this, props))
  }

  prompting_choices() {

    this.bad = false
    if (this.template == undefined) {
      if (!fs.existsSync(this.templatefoldername)){
        this.bad = true
        this.template = 'folder'
        console.log('Error, Template folder does not exist')
        return
      }
    }
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
        name: 'gitRepository',
        default: config.gitRepository
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
        message: 'What is the URL to submit Bugs?',
        name: 'bugs',
        default: config.bugs
      },
      {
        type: 'input',
        message: 'What is the Home Page URL?',
        name: 'homepage',
        default: config.homepage
      }
    ];
    return this.prompt(prompts).then(props => Object.assign(this, props));
  }

  prompting_desc() {
    if (this.skip == true ) { return }
    if (this.bad == true) {return}

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
    if (this.bad == true) {return}

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
    if (this.skip == true ) { 
      console.log(chalk.green('Defaults here...'))
    }

    if (this.template == undefined) {this.template = 'folder'}
    this.destinationRoot(this.packageName);
    const packageInfo = {};
    Object.assign(packageInfo, {
      name: this.packageName
    });
    if (this.version) packageInfo.version = this.version;
    if (this.description) packageInfo.description = this.description;
    packageInfo.scripts = {
      start: 'sencha app watch',
      build: 'sencha app build'
    }
    if (this.gitRepository) {
      packageInfo.repository = {
        type: 'git',
        url: this.gitRepository
      }
    }
    if (this.keywords) {
      packageInfo.keywords = this.keywords
    }
    if (this.author) packageInfo.author = this.author;
    if (this.license) packageInfo.license = this.license;
    if (this.bugs) {
      packageInfo.bugs = {
        url: this.bugs
      }
    }
    if (this.homepage) packageInfo.homepage = this.homepage;
    packageInfo.dependencies = {
      "@extjs/ext-react": "^6.5.1"
    }
    packageInfo.devDependencies = {
      '@extjs/sencha-cmd': "^6.5.4"
    }
    this.fs.writeJSON('package.json', packageInfo, null, '  ');
  }

  install() {
    if (this.bad == true) { return }

    this.installDependencies({
      bower: false,
      npm: true,
      skipMessage: true
    }).then(() => 
      {
        console.log('\n' + chalk.green('npm install is completed')+ '\n')
        var app = require('sencha-node/generate/app.js')
        var options = { 
          parms: [ 'gen', 'app', this.appName, './' ],
          sdk: 'node_modules/@extjs/ext-react',
          template: this.template,
          templateFull: this.templatefoldername,
          force: false 
        }
        new app({ options: options })
      }
    )
  }

  end() {
    if (this.bad == true) { return }

    this.log(`
${chalk.green.underline('Your new Ext JS app is ready!')}

cd ${this.packageName} then "npm start" to run the development build and open your new app in a web browser.
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