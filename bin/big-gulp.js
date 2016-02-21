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
      message: "Where are your source files?",
      default: 'source',
      validate: validators.dir
    },
    {
      type: 'input',
      name: 'build',
      message: 'Where do you want build (generated) files?',
      default: 'build',
      validate: validators.dir
    },
    {
      type: 'list',
      name: 'css',
      message: 'Which CSS preprocessor?',
      choices: utils.optionsForGroup('css', 'None'),
      filter: validators.falseIfNone
    },
    {
      type: 'list',
      name: 'js',
      message: 'Which Javascript preprocessor?',
      choices: utils.optionsForGroup('js', 'None'),
      filter: validators.falseIfNone
    },
     {
      type: 'confirm',
      name: 'browserify',
      message: 'Would you like to Browserify your js?'
    },
    {
      type: 'list',
      name: 'template',
      message: 'Which template engine?',
      choices: utils.optionsForGroup('template', 'None'),
      filter: validators.falseIfNone
    },
    {
      type: 'list',
      name: 'data',
      message: 'Need external data files?',
      choices: utils.optionsForGroup('data', ['None']),
      when: function (answers) { return answers.template; },
      filter: validators.falseIfNone
    },
    {
      type: 'confirm',
      name: 'frontmatter',
      message: 'User frontmatter for vars in template headers?',
      when: function (answers) { return answers.template; }
    },
    {
      type: 'input',
      name: 'dataDir',
      message: 'Where will you store data files?',
      default: function (answers) { return answers.source + "/data"; },
      when: function (answers) { return answers.data; },
      validate: validators.dir
    },
    {
      type: 'confirm',
      name: 'server',
      message: 'Want a localhost server?',
      when: function (answers) { return answers.template; }
    },
    {
      type: 'input',
      name: 'serverPort',
      default: 8080,
      message: 'What port for localhost?',
      when: function (answers) { return answers.server; }
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
      console.log('all set, `npm install` and then run `gulp`'.green.bold);
    });
  });
}
