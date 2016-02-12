
var _ = require('underscore'),
  camel = require('underscore.string/camelize'),
  path = require('path'),
  fs = require('fs-extra'),
  Handlebars = require('handlebars'),
  async = require('async'),
  decache = require('decache'),
  q = require('q'),
  gulpFile = fs.createWriteStream(path.join(process.cwd(), 'gulpfile.js')),
  utils = require('./utils'),
  engines = utils.loadEngines();
  
module.exports.build = function (answers) {
  var choices = _.values(answers),
    matches = _.filter(engines, function (engine) {
      return _.contains(choices, engine.name);
    }),
    libs = _.find(engines, {name: 'global'}).dependencies;
  
  _.chain(matches).pluck('dependencies').each(function (libraries) {
    libs = _.extend(libs, libraries);
  });
 
  renderHeader(libs, answers).then(function () {

    async.each(matches, function (engine, cb) {
      var tmplFile = path.join(__dirname, 'templates', engine.template);

      fs.readFile(tmplFile, 'utf8', function (err, contents) {
        if (err) console.log('cant load %s'.bgRed.white, tmplFile);

        var tmpl = Handlebars.compile(contents),
          data = answers;

        data.engine = engine;
        gulpFile.write(tmpl(data), cb);
      });

    }, function () {
      renderFooter(matches).then(function () {
        gulpFile.end();
        addToPackage(libs);
      });
    });

  });
}

function addToPackage(libs) {
  var data = utils.loadPackage();
  data.devDependencies = data.devDependencies || {};

  _.keys(libs).forEach(function (key) {
    data.devDependencies[key] = libs[key];
  });
    
  fs.writeJson(utils.packagePath, data, function () {
    console.log('Setup complete! run npm install, and then gulp'.green);
  });
}

function renderHeader(libs, answers) {
  var defer = q.defer(),
    keyVals = _.chain(libs).mapObject(function (val, key) {
      return camel(key);
    }).invert().value();

  answers.libs = keyVals;

  fs.readFile(path.join(__dirname, 'templates', 'header.hbs'), 'utf8', function (err, contents) {
    var template = Handlebars.compile(contents);
    gulpFile.write(template(answers), defer.resolve);
  });

  return defer.promise;
}

function renderFooter(matches) {
  var defer = q.defer(),
    tasks = _.pluck(matches, 'task');

   fs.readFile(path.join(__dirname, 'templates', 'footer.hbs'), 'utf8', function (err, contents) {
    var template = Handlebars.compile(contents);
    gulpFile.write(template({tasks: tasks}), defer.resolve);
  });

  return defer.promise;
}