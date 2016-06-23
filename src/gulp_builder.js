"use strict";

const path = require('path');
const gulpFile = path.join(process.cwd(), 'gulpfile.js');
const templatePath = path.join(__dirname, '/templates');
const fs = require('fs-extra');
const Handlebars = require('handlebars');
const helpers = require('./handlebars_helpers');
const _ = require('underscore');
const mkdirp = require('mkdirp');

module.exports = class {

  constructor(answers) {
    this.answers = answers;
    this.answers.cssExt = this.constructor.cssExt(this.answers);
    this.answers.jsExt =
    this.answers.tasks = this.getTasks();
    this.makeDirs();

    Handlebars.registerPartial('cssBody', fs.readFileSync(`${templatePath}/css_body.hbs.js`, 'utf8'));
    Handlebars.registerPartial('cssHeader', fs.readFileSync(`${templatePath}/css_header.hbs.js`, 'utf8'));

    Handlebars.registerPartial('jsBody', fs.readFileSync(`${templatePath}/js_body.hbs.js`, 'utf8'));
    Handlebars.registerPartial('jsHeader', fs.readFileSync(`${templatePath}/js_header.hbs.js`, 'utf8'));

    let tmpl = Handlebars.compile(fs.readFileSync(`${templatePath}/gulpfile.hbs.js`, 'utf8'));
    fs.outputFile(gulpFile, tmpl(this.answers), err => console.log('Gulpfile.js has been created'.green));
  }

  makeDirs() {
    if (this.answers.jsSource) this.makeDir(this.answers.jsSource);
    if (this.answers.jsDest) this.makeDir(this.answers.jsDest);

    if (this.answers.cssSource) this.makeDir(this.answers.cssSource);
    if (this.answers.cssDest) this.makeDir(this.answers.cssDest);
  }

  getTasks() {
    let tasks = {};
    if (this.answers.js) {
      tasks.js = {
        src: this.answers.jsSource,
        dest: this.answers.jsDest,
        ext: this.constructor.jsExt(this.answers)
      }
    }
    if (this.answers.css) {
       tasks.css = {
        src: this.answers.cssSource,
        dest: this.answers.cssDest,
        ext: this.constructor.cssExt(this.answers)
      }
    }
    return tasks;
  }

  makeDir(dir) {
    let dest = path.join(process.cwd(), dir);
    try {
      mkdirp.sync(dest);
      console.log(`${dest} created.`.green);
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

  static cssExt(answers) {
    if (answers.cssProcessor) {
      return answers.cssProcessor === 'stylus' ? 'styl' : answers.cssProcessor;
    }
    return 'css';
  }
}