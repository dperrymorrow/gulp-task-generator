"use strict";

const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const colors = require('colors');
const questions = require('./questions');
const PackageBuilder = require('./package_builder');
const GulpBuilder = require('./gulp_builder');

module.exports = class {

  constructor(args) {
    console.log(`> Running Gulp-Generator in ${process.cwd()}`.yellow);
    this.args = args;

    this.checkPackageFile()
      .then(() => this.checkGulpFile())
      .then(() => this.beginQuiz());
  }

  exitWithMsg(msg) {
    console.log(msg.red.bold);
    process.exit();
  }

  beginQuiz() {
    inquirer.prompt(questions, answers => {
      if (this.args[0] !== 'install=false') new PackageBuilder(answers);
      new GulpBuilder(answers);
    });
  }

  checkPackageFile() {
    return new Promise((resolve, reject) => {

      fs.stat(path.join(process.cwd(), 'package.json'), (err, stat) => {
        if (err) {
          this.exitWithMsg("!! I don't see a package.json file, please run `npm init`".red);
        } else {
          resolve();
        }
      });

    });
  }

  checkGulpFile() {
    return new Promise((resolve, reject) => {

      fs.stat(path.join(process.cwd(), 'Gulpfile.js'), (err, stat) => {
        if (stat) {

          inquirer.prompt(
            [{
              type: 'confirm',
              name: 'continue',
              message: "You already have a Gulpfile.js. Overwrite?"
            }],
            answers => answers.continue ? resolve() : this.exitWithMsg('Ok, stopping. Your Gulpfile.js is unchanged.')
          );

        } else {
          resolve();
        }
      });

    });
  }

}


