
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
  engines = utils.loadEngines();
  
module.exports.build = function (answers) {
  var choices = _.values(answers),
    defer = q.defer(),
    matches = _.filter(engines, function (engine) {
      return _.contains(choices, engine.name);
    }),
    libs = getLibs(matches);
  
  fs.readFile(path.join(__dirname, 'gulpfile.hbs'), 'utf8', function (err, contents) {
    var tmpl = Handlebars.compile(contents),
      data = answers;

    data.libs = libs;
    
    fs.outputFile(gulpFile, tmpl(data), function (err) {
      addToPackage(libs)
        .then(function () {
          return createDirs(answers);
        }).then(defer.resolve);
    });

  });

  return defer.promise;
}

function addToPackage(libs) {
  
  console.log("Adding the following dependencies to " + utils.packagePath);
  console.log(_.values(libs).join(", "));

  var data = utils.loadPackage(),
    defer = q.defer();

  data.devDependencies = data.devDependencies || {};

  _.keys(libs).forEach(function (key) {
    data.devDependencies[key] = libs[key];
  });
    
  fs.writeJson(utils.packagePath, data, function () {
    defer.resolve();
  });

  return defer.promise;
}

function getLibs(matches) {
  var libs = _.find(engines, {name: 'global'}).dependencies;
  _.chain(matches).pluck('dependencies').each(function (libraries) {
    libs = _.extend(libs, libraries);
  });

  return _.chain(libs).mapObject(function (val, key) {
      return camel(key);
    }).invert().value();
}

function createDirs(answers) {
  var defer = q.defer(),
    cwd = process.cwd(),
    dirs = [
      path.join(cwd, answers.source),
      path.join(cwd, answers.build)
    ];
  
  if (answers.data) dirs.push(path.join(cwd, answers.dataDir));

  async.each(dirs, function (dir, cb) {
    fs.mkdirs(dir, function (err) {
      if (err) return console.error(err)
      console.log("creating dir: ".yellow + dir.cyan);
      cb();
    });
  }, defer.resolve);
    
  return defer.promise;
}
