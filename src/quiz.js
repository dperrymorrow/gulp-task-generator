"use strict";

const path = require('path');
const _ = require('underscore');
const fs = require('fs');
const inquirer = require('inquirer');
const colors = require('colors');
const questions = require('./questions');
const PackageBuilder = require('./package_builder');
const GulpBuilder = require('./gulp_builder');

module.exports = class {

  constructor(args) {
    this.divider("questions");
    this.args = args;

    this.checkPackageFile()
      .then(() => this.checkGulpFile())
      .then(() => this.beginQuiz());
  }

  divider(title) {
    let len = Math.round((70 - title.length) / 2);
    let dashes = "";
    _(len).times(() => {
      dashes += "-";
    });

    console.log(`${dashes} ${title.toUpperCase()} ${dashes}`.cyan);
  }

  exitWithMsg(msg) {
    console.log(msg.red.bold);
    process.exit();
  }

  beginQuiz() {
    inquirer.prompt(questions, answers => {
      this.divider('creating dirs & files');
      new GulpBuilder(_.clone(answers));
      setTimeout(() => {
        this.divider('installing dependencies');
        if (this.args[0] !== 'install=false') new PackageBuilder(_.clone(answers));
      }, 500);
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


