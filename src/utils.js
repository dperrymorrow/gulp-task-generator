var _ = require('underscore'),
  decache = require('decache'),
  path = require('path');

module.exports = {

  engines: null,
  package: null,
  packagePath: path.join(process.cwd(), 'package.json'),

  optionsForGroup: function (group) {
    return _.chain(this.loadEngines()).where({'group': group}).pluck('name').value();
  },

  loadEngines: function () {
    if (_.isNull(this.engines)) {
      decache('./engines.json');
      this.engines = require('./engines.json');
    }
    return this.engines;
  },

  loadPackage: function () {
    if (_.isNull(this.package)) {
      decache(this.packagePath);
      this.package = require(this.packagePath);
    }
    return this.package;
  }

}