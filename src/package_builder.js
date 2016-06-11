"use strict";

const path = require('path');
const exec = require('child_process').exec;
const libs = require('./dependencies.json');
const _ = require('underscore');

module.exports = class {

  constructor(answers) {
    this.answers = answers;
    this.buildList();
    this.install();
    return new Promise((resolve, reject) => this.resolve = resolve);
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

    let child = exec(`npm i ${this.packages} --save`, (error, stdout, stderr) => {
      process.stdout.write(stdout);

      if (error) {
        console.error(`!! error installing packages: ${error}`.red);
        return;
      }
      console.log('> All NPM packages have been installed.'.green);
      this.resolve();
    });

  }
}