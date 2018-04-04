#!/usr/bin/env node

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { kebabCase, pick } = require('lodash')

//const { execSync, spawnSync, fork } = require('child_process');

// function _getSenchCmdPath() {
//   try {
//       // use @extjs/sencha-cmd from node_modules
//       return require('@extjs/sencha-cmd');
//   } catch (e) {
//       // attempt to use globally installed Sencha Cmd
//       return 'sencha';
//   }
// }

module.exports = class extends Generator {

  prompting_name() {
    this.log('\n' + chalk.bold.underline('Welcome to the Ext JS app generator') + '\n');
    return this.prompt([{
      type: 'input',
      name: 'appName',
      message: 'What would you like to name your app?',
      default: 'MyApp'
    }]).then(props => Object.assign(this, props));
  }

  prompting_choices() {
    const prompts = [
      {
        type: 'input',
        name: 'packageName',
        message: 'What would you like to name the npm package?',
        default: kebabCase(this.appName)
      },
      {
        type: 'list',
        name: 'template',
        message: 'What theme would you like to use?',
        choices: ['universalmodern', 'moderndesktop']
      },
      {
        type: 'input',
        message: 'version:',
        name: 'version',
        default: '1.0.0'
      }, 
      {
        type: 'input',
        message: 'git repository:',
        name: 'gitRepository',
        default: 'https://github.com/'
      }, 
      {
        type: 'input',
        message: 'keywords:',
        name: 'keywords',
        default: 'Ext JS'
      }, 
      {
        type: 'input',
        message: 'author:',
        name: 'author',
        default: 'Sencha, Inc.'
      }, 
      {
        type: 'input',
        message: 'license',
        name: 'license',
        default: 'ISC'
      },
      {
        type: 'input',
        message: 'bugs',
        name: 'bugs',
        default: 'https://github.com/'
      },
      {
        type: 'input',
        message: 'homepage',
        name: 'homepage',
        default: 'http://www.sencha.com/'
      }
    ];
    return this.prompt(prompts).then(props => Object.assign(this, props));
  }

  prompting_desc() {
    const prompts = [
      {
        type: 'input',
        message: 'description:',
        name: 'description',
        default: this.packageName + ' description',
      },
      {
        type: 'confirm',
        name: 'createDirectory',
        message: 'Would you like to create a new directory for your project?',
        default: true
      }
    ] 
    return this.prompt(prompts).then(props => Object.assign(this, props))
  }

  writing() {
    if (this.createDirectory) {
      this.destinationRoot(this.packageName);
    }
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
      packageInfo.keywords = [
        this.keywords
      ]
    }
    if (this.author) packageInfo.author = this.author;
    if (this.license) packageInfo.license = this.license;
    if (this.bugs) {
      packageInfo.bugs = {
        url: this.bugs
      }
    }
    if (this.homepage) packageInfo.homepage = this.homepage;
    //Object.assign(packageInfo, pick(this.fs.readJSON('package.json'), 'main', 'scripts', 'dependencies', 'devDependencies', 'jest'));
    packageInfo.dependencies = {
      "@extjs/ext-react": "^6.5.1"
    }
    packageInfo.devDependencies = {
      '@extjs/sencha-cmd': "^6.5.4"
    }
    this.fs.writeJSON('package.json', packageInfo, null, '  ');
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: true
    }).then(() => 
      {
        console.log(chalk.green('npm install is completed'))

        //let sencha = _getSenchCmdPath();
        //var args = ['--sdk', 'node_modules/@extjs/ext-react', 'generate', 'app', '--template', this.template, this.appName, './']
        //spawnSync('sn',args, {stdio: 'inherit',cwd: output, silent: false});

        var app = require('sencha-node/generate/app.js')
        var options = { 
          parms: [ 'gen', 'app', this.appName, './' ],
          sdk: 'node_modules/@extjs/ext-react',
          template: this.template,
          force: false 
        }
        new app({ options: options })
      }
    );
  }

  end() {
    const chdir = this.createDirectory ? '"cd ' + this.packageName + '" then ' : '';
    this.log(
      '\n' + chalk.green.underline('Your new Ext JS app is ready!') +
      '\n' +
      '\nType ' + chdir + '"npm start" to run the development build and open your new app in a web browser.' +
      '\n'
    );
  }

}
