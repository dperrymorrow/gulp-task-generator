
var _ = require('underscore'),
  camel = require('underscore.string/camelize'),
  path = require('path'),
  fs = require('fs-extra'),
  Handlebars = require('handlebars'),
  helpers = require('./handlebars_helpers'),
  async = require('async'),
  decache = require('decache'),
  q = require('q'),
  gulpFile = path.join(process.cwd(), 'gulpfile.js'),
  utils = require('./utils'),
  engines = utils.loadEngines(),
  matches = {},
  answers = {};
  
module.exports.build = function (result) {
  answers = result;
  console.log(answers);

  var choices = _.values(answers),
    defer = q.defer();
    
  matches = _.filter(engines, function (engine) {
    return _.contains(choices, engine.name) || answers[engine.name] == true || engine.name === 'global';
  });
  
  fs.readFile(path.join(__dirname, 'gulpfile.hbs'), 'utf8', function (err, contents) {
    var tmpl = Handlebars.compile(contents),
      data = answers;

    data.libs = getLibs(matches, true);
    
    fs.outputFile(gulpFile, tmpl(data), function (err) {
      addToPackage()
        .then(function () {
          return createDirs();
        }).then(function () {
          defer.resolve();
        });
    });
  });

  return defer.promise;
}

function addToPackage() {
  var libs = getLibs(false),
    data = utils.loadPackage(),
    defer = q.defer();

  data.devDependencies = data.devDependencies || {};

  console.log("");
  console.log("Adding npm dependencies ".cyan);
  _.keys(libs).forEach(function (key) {
    console.log(key + ": " + libs[key]);
  });

  _.keys(libs).forEach(function (key) {
    data.devDependencies[key] = libs[key];
  });
    
  fs.writeJson(utils.packagePath, data, function () {
    defer.resolve();
  });

  return defer.promise;
}

function getLibs(invert) {
  invert = _.isUndefined(invert) ? false : invert;
  var libs = {};
  _.chain(matches).pluck('dependencies').each(function (libraries) {
    libs = _.extend(libs, libraries);
  });

  return invert ? _.chain(libs).mapObject(function (val, key) {
      return camel(key);
    }).invert().value() : libs;
}

function createDirs() {
  var defer = q.defer(),
    cwd = process.cwd(),
    dirs = [
      path.join(cwd, answers.source),
      path.join(cwd, answers.build)
    ];
  
  if (answers.data) dirs.push(path.join(cwd, answers.dataDir));

  async.each(dirs, function (dir, cb) {
    fs.mkdir(dir, function (err) {
      console.log("creating dir: ".yellow + dir.cyan);
      
      if (err && err.code === 'EEXIST') {
        console.log('Already exists! skipping...'.gray);
      }

      cb();
    });
  }, defer.resolve);

  return defer.promise;
}
