"use strict";

const inquirer = require('inquirer');
const validFileName = require('valid-filename');
const invalidDir = require('is-invalid-path');
const GulpBuilder = require('./gulp_builder');

module.exports = [
  // CSS
  {
    type: 'confirm',
    name: 'css',
    message: 'Would you like to run CSS tasks?'
  }, {
    type: 'list',
    name: 'cssProcessor',
    message: 'Which CSS pre-processor would you like to use?',
    choices: ['less', 'scss', 'stylus', new inquirer.Separator(), 'None'],
    filter: falseIfNone,
    when: answers => answers.css
  }, {
    type: 'confirm',
    name: 'autoPrefix',
    message: 'Would you like to autoprefix your CSS?',
    when: answers => answers.css
  }, {
    type: 'confirm',
    name: 'cssMin',
    message: 'Would you like your CSS minified?',
    when: answers => answers.css
  }, {
    type: 'confirm',
    name: 'cssConcat',
    message: 'Would you like your CSS files concatenated?',
    when: answers => answers.css
  }, {
    type: 'input',
    name: 'cssFile',
    message: 'Name of your concatenated CSS file?',
    default: 'main.css',
    validate: file,
    when: (answers) => answers.cssConcat
  }, {
    type: 'input',
    name: "cssSource",
    message: "Where are your CSS source files?",
    default: answers => `source/${answers.cssProcessor || 'css'}`,
    validate: dir,
    when: answers => answers.css
  }, {
    type: 'input',
    name: 'cssDest',
    message: 'Where do you want your compiled CSS (generated) files?',
    default: 'build/css',
    validate: dir,
     when: answers => answers.css
  },
  // JAVASCRIPT
  {
    type: 'confirm',
    name: 'js',
    message: 'Would you like to run Javascript tasks?'
  }, {
    type: 'confirm',
    name: 'coffeeScript',
    message: 'Will you be using Coffeescript?',
    when: answers => answers.js
  }, {
    type: 'confirm',
    name: 'babel',
    message: 'Convert ES6 to ES5?',
    when: answers => answers.js
  }, {
    type: 'confirm',
    name: 'jsHint',
    message: 'Would you like to run JsHint on your Javascript?',
    when: answers => answers.js
  }, {
    type: 'confirm',
    name: 'jsConcat',
    message: 'Would you like to concatenate and minify your Javascript?',
    when: answers => answers.js
  }, {
    type: 'input',
    name: 'jsFile',
    message: 'Name of your concatenated js file?',
    default: 'main.js',
    validate: file,
    when: (answers) => answers.jsConcat && answers.js
  }, {
    type: 'input',
    name: "jsSource",
    message:  answers => `Where are your .${GulpBuilder.jsExt(answers)} source files?`,
    default: answers => `source/${GulpBuilder.jsExt(answers)}`,
    validate: dir,
    when: answers => answers.js
  }, {
    type: 'input',
    name: 'jsDest',
    message: 'Where do you want your compiled Javascript (generated) files?',
    default: 'build/js',
    validate: dir,
    when: answers => answers.js
  },
  // HTML
  {
    type: 'confirm',
    name: 'html',
    message: 'Would you like to use a template engine for HTML?'
  }, {
    type: 'list',
    name: 'htmlProcessor',
    message: 'Which HTML template engine would you like to use?',
    choices: ['jade', 'ejs'],
    when: answers => answers.html
  }, {
    type: 'input',
    name: "htmlSource",
    message:  answers => `Where are your .${GulpBuilder.htmlExt(answers)} source files?`,
    default: answers => `source/${GulpBuilder.htmlExt(answers)}`,
    validate: dir,
    when: answers => answers.html
  }, {
    type: 'input',
    name: 'jsDest',
    message: 'Where do you want your compiled HTML (generated) files?',
    default: 'build/',
    validate: dir,
    when: answers => answers.html
  },
];

function dir(name) {
  return invalidDir(name) ? "Not valid, only [A-Z], [a-z], [0-9], -, and _" : true;
}

function file(name) {
  return validFileName(name) ? true : "Not valid, only [A-Z], [a-z], [0-9], -, ., and _";
}

function falseIfNone(answer) {
  return answer.toLowerCase() === 'none' ? false : answer;
}

