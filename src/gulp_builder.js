"use strict";

const path = require('path');
const gulpFile = path.join(process.cwd(), 'gulpfile.js');
const fs = require('fs-extra');
const Handlebars = require('handlebars');
const helpers = require('./handlebars_helpers');
const _ = require('underscore');

module.exports = class {

  constructor(answers) {
    this.answers = answers;
    this.answers.cssExt = this.constructor.cssExt(this.answers);
    this.answers.css = this.constructor.processCss(this.answers);

    if (this.answers.processCss) {
      this.makeDir(this.answers.cssSource);
      this.makeDir(this.answers.cssDest);
    }

    fs.readFile(path.join(__dirname, 'gulpfile.hbs'), 'utf8', (err, contents) => {
      let tmpl = Handlebars.compile(contents);
      fs.outputFile(gulpFile, tmpl(this.answers), err => console.log('Gulpfile.js has been created'.green));
    });
  }

  makeDir(dir) {
    let dest = path.join(process.cwd(), dir);
    try {
      fs.mkdirSync(dest);
      console.log(`${dest} created.`.green);
    } catch(e) {
      if ( e.code == 'EEXIST' ) console.log(`${dest} already exists, skipping.`.red);
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