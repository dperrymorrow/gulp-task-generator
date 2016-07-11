"use strict";

const exec = require('child_process').exec;
const libs = require('./dependencies');
const _ = require('underscore');
const spinner = require('simple-spinner');

module.exports = class {

  constructor(answers) {
    this.answers = answers;
    this.buildList();
    this.install();
  }

  buildList() {
    this.packages =
      _.chain(this.answers)
      .keys()
      .map(key => _.isBoolean(this.answers[key]) ? libs[key] : libs[this.answers[key].toLowerCase()])
      .flatten()
      .filter(value => !_.isUndefined(value))
      .value().concat(libs.core).join(' ');
  }

  install() {
    console.log("> Installing the NPM packages based on your choices.".yellow);
    spinner.start(150, {hideCursor: true, doNotBlock: true});

    let child = exec(`npm i ${this.packages} --save`, (error, stdout, stderr) => {
      process.stdout.write(stdout);

      if (error) {
        console.error(`!! error installing packages: ${error}`.red);
        return;
      }
      console.log('> All NPM packages have been installed.'.green);
      spinner.stop();
    });

  }
}