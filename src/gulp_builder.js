
var _ = require('underscore'),
  path = require('path'),
  fs = require('fs-extra'),
  Handlebars = require('handlebars'),
  async = require('async'),
  decache = require('decache'),
  q = require('q'),
  packagePath = path.join(process.cwd(), 'package.json'),
  gulpFile = fs.createWriteStream(path.join(process.cwd(), 'gulpfile.js'));

decache('./engines.json');
decache(packagePath);

var packageData = require(packagePath),
  engines = require('./engines.json');
  
module.exports.build = function (answers) {
  var choices = _.values(answers).map(function (value) { return value.toLowerCase(); }),
    matches = _.chain(engines).pick(choices).values().value(),
    libs = {};

  _.chain(matches).pluck('dependencies').each(function (libraries) {
    libs = _.extend(libs, libraries);
  });
 
  renderRequires(libs).then(function () {

    async.each(matches, function (engine, cb) {
      var tmplFile = path.join(__dirname, engine.template);

      fs.readFile(tmplFile, 'utf8', function (err, contents) {
        var tmpl = Handlebars.compile(contents);
        gulpFile.write(tmpl(answers), cb);
      });

    }, function () {
      gulpFile.end();
      addToPackage(libs);
    });

  });
}

function addToPackage(libs) {
  packageData.devDependencies = packageData.devDependencies || {};

  _.keys(libs).forEach(function (key) {
    packageData.devDependencies[key] = libs[key];
  });
    
  fs.writeJson(path.join(process.cwd(), 'package.json'), packageData, function () {
    console.log('Setup complete! run npm install, and then gulp'.green);
  });
}

function renderRequires(libs) {
  var defer = q.defer(),
    keyVals = _.chain(libs).mapObject(function (val, key) {
      return key.replace('gulp-', '');
    }).invert().value();

  fs.readFile(path.join(__dirname, 'templates/requires.hbs'), 'utf8', function (err, contents) {
    var template = Handlebars.compile(contents);
    gulpFile.write(template({libs: keyVals}), defer.resolve);
  });

  return defer.promise;
}