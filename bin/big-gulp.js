#!/usr/bin/env node

var path = require('path'),
  fs = require('fs-extra'),
  colors = require('colors'),
  inquirer = require('inquirer'),
  validators = require('./../src/validators'),
  gulp_builder = require('./../src/gulp_builder'),
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
      name: 'engine_data',
      message: 'What data would you like to use?',
      choices: [
        'JSON', 'YAML', 'None',
      ]
    },
    {
      type: 'list',
      name: 'css',
      message: 'Which CSS preprocessor would you like to use?',
      choices: [
        'LESS', 'SCSS', 'Stylus', 'None',
      ]
    },
    {
      type: 'list',
      name: 'js',
      message: 'Which Js preprocessor would you like to use?',
      choices: [
        'Babel', 'Coffeescript', 'None',
      ]
    },
    {
      type: 'list',
      name: 'engine_template',
      message: 'Which template would you like to use?',
      choices: [
        'Jade', 'Ejs', 'Mustache', 'None',
      ]
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
    gulp_builder.build(answers);
  });
}
