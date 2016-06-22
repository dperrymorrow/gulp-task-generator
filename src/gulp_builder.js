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
    this.answers.css = this.constructor.processCss(this.answers);
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

  static processCss(answers) {
    return answers.cssProcessor || answers.autoprefix || answers.cssMinify || answers.cssConcat;
  }

  static cssExt(answers) {
    if (answers.cssProcessor) {
      return answers.cssProcessor === 'stylus' ? 'styl' : answers.cssProcessor;
    }
    return 'css';
  }
}