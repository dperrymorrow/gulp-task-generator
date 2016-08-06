"use strict";

const path = require('path');
const gulpFile = path.join(process.cwd(), 'gulpfile.js');
const templatePath = path.join(__dirname, '/templates');
const fs = require('fs-extra');
const Handlebars = require('handlebars');
const _ = require('underscore');
const mkdirp = require('mkdirp');
const colors = require('colors');
const helpers = require('./handlebars_helpers');

module.exports = class {

  constructor(answers) {
    this.answers = answers;
    this.answers.tasks = this.getTasks();
    this.makeDirs();

    ['js', 'css', 'html'].forEach(lang => {
      Handlebars.registerPartial(`${lang}Body`, fs.readFileSync(`${templatePath}/${lang}_body.hbs.js`, 'utf8'));
      Handlebars.registerPartial(`${lang}Header`, fs.readFileSync(`${templatePath}/${lang}_header.hbs.js`, 'utf8'));
    });

    let tmpl = Handlebars.compile(fs.readFileSync(`${templatePath}/gulpfile.hbs.js`, 'utf8'));
    fs.outputFile(gulpFile, tmpl(this.answers), err => {
      console.log(
        colors.cyan('gulpfile.js') + " => " + colors.green("created")
      );
    });
  }

  makeDirs() {
    ['js', 'css', 'html'].forEach(lang => {
      if (this.answers[`${lang}Source`]) this.makeDir(this.answers[`${lang}Source`]);
      if (this.answers[`${lang}Dest`]) this.makeDir(this.answers[`${lang}Dest`]);
    });
  }

  getTasks() {
    let tasks = {};
    ['js', 'css', 'html'].forEach(lang => {
      if (this.answers[lang]) {
        tasks[lang] = {
          src: this.answers[`${lang}Source`],
          dest: this.answers[`${lang}Dest`],
          ext: this.constructor[`${lang}Ext`](this.answers)
        }
      }
    });

    return tasks;
  }

  makeDir(dir) {
    let dest = path.join(process.cwd(), dir);
    try {
      mkdirp.sync(dest);
      console.log(
        colors.cyan(dest.split(process.cwd())[1]) + " => " + colors.green('created')
      );
    } catch(e) {
      if ( e.code == 'EEXIST' ) {
        console.log(`${dest} already exists, skipping.`.red);
      } else {
        console.log(e);
      }
    }
  }

  static jsExt(answers) {
    return answers.coffeeScript ? 'coffee' : 'js';
  }

  static htmlExt(answers) {
    return answers.htmlProcessor;
  }

  static cssExt(answers) {
    if (answers.cssProcessor) {
      return answers.cssProcessor === 'stylus' ? 'styl' : answers.cssProcessor;
    }
    return 'css';
  }
}