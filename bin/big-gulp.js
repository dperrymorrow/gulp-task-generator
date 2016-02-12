#!/usr/bin/env node

var path = require('path'),
  fs = require('fs-extra'),
  colors = require('colors'),
  inquirer = require('inquirer'),
  _ = require('underscore'),
  engines = require('./../src/engines'),
  validators = require('./../src/validators'),
  gulp_builder = require('./../src/gulp_builder'),
  utils = require('./../src/utils'),
  questions = [
    {
      type: 'input',
      name: "source",
      message: "Where will you keep your source files?",
      default: 'source',
      validate: validators.dir
    },
    {
      type: 'input',
      name: 'build',
      message: 'Where would you like your build (generated) files?',
      default: 'build',
      validate: validators.dir
    },
    {
      type: 'list',
      name: 'data',
      message: 'What data would you like to use?',
      choices: utils.optionsForGroup('data', ['None']),
      filter: validators.falseIfNone
    },
    {
      type: 'input',
      name: 'dataDir',
      message: 'Where would you like to keep your data?',
      default: function (answers) { return answers.source + "/data"; },
      when: function (answers) { return answers.data === 'None' ? false : true; },
      validate: validators.dir
    },
    {
      type: 'list',
      name: 'css',
      message: 'Which CSS preprocessor would you like to use?',
      choices: utils.optionsForGroup('css', 'None'),
      filter: validators.falseIfNone
    },
    {
      type: 'list',
      name: 'js',
      message: 'Which Js preprocessor would you like to use?',
      choices: utils.optionsForGroup('js', 'None'),
      filter: validators.falseIfNone
    },
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: utils.optionsForGroup('template'),
      filter: validators.falseIfNone
    }
  ];

// npm.load(function (err) {
  checkGulpFile();
// });

function checkGulpFile() {
  fs.stat(path.join(process.cwd(), 'gulpfile.js'), function(err, stat) { 
    if (stat) { 
      inquirer.prompt([{
          type: 'confirm',
          name: 'continue',
          message: "You already have a gulpfile.js. Overwrite?"
        }], function (answers) {
          
          if (answers.continue) {
            start();
          } else {
            console.log('Ok, exiting...'.red);
            process.exit();
          }

        });
    } else {
      start();
    }
  }); 
}

function start() {
  inquirer.prompt(questions, function (answers) {
    gulp_builder.build(answers).then(function () {
      console.log('all set, npm install and then run gulp'.green);
    });
  });
}
