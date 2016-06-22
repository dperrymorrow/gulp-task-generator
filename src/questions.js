"use strict";

const inquirer = require('inquirer');
const validFileName = require('valid-filename');
const invalidDir = require('is-invalid-path');
const GulpBuilder = require('./gulp_builder');

module.exports = [
  // CSS
  {
    type: 'list',
    name: 'cssProcessor',
    message: 'Which CSS pre-processor would you like to use?',
    choices: ['less', 'scss', 'stylus', new inquirer.Separator(), 'None'],
    filter: falseIfNone
  }, {
    type: 'confirm',
    name: 'autoPrefix',
    message: 'Would you like to autoprefix your CSS?'
  }, {
    type: 'confirm',
    name: 'cssMin',
    message: 'Would you like your CSS minified?'
  }, {
    type: 'confirm',
    name: 'cssConcat',
    message: 'Would you like your CSS files concatenated?'
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
    when: GulpBuilder.processCss
  }, {
    type: 'input',
    name: 'cssDest',
    message: 'Where do you want your compiled CSS (generated) files?',
    default: 'build/css',
    validate: dir,
    when: GulpBuilder.processCss
  },
  // JAVASCRIPT
  {
    type: 'confirm',
    name: 'coffeeScript',
    message: 'Will you be using Coffeescript?'
  }, {
    type: 'confirm',
    name: 'babel',
    message: 'Convert ES6 to ES5?'
  }, {
    type: 'confirm',
    name: 'jsHint',
    message: 'Would you like to run JsHint on your Javascript?'
  }, {
    type: 'confirm',
    name: 'jsConcat',
    message: 'Would you like to concatenate and minify your Javascript?'
  }, {
    type: 'input',
    name: 'jsFile',
    message: 'Name of your concatenated js file?',
    default: 'main.js',
    validate: file,
    when: (answers) => answers.jsConcat
  }, {
    type: 'input',
    name: "jsSource",
    message:  answers => `Where are your ${answers.coffeeScript ? 'CoffeeScript' : 'Javascript'} source files?`,
    default: answers => `source/${answers.coffeeScript ? 'coffee' : 'js'}`,
    validate: dir,
    when: needJsDir
  }, {
    type: 'input',
    name: 'jsDest',
    message: 'Where do you want your compiled Javascript (generated) files?',
    default: 'build/js',
    validate: dir,
    when: needJsDir
  }
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

function needJsDir(answers) {
  return answers.coffeeScript || answers.babel || answers.jsMinify || answers.jsConcat;
}

