var _ = require('underscore'),
  decache = require('decache'),
  path = require('path');

module.exports = {

  engines: null,
  package: null,
  packagePath: path.join(process.cwd(), 'package.json'),

  optionsForGroup: function (group, add) {
    var opts = _.chain(this.loadEngines()).where({'group': group}).pluck('name').value();
    add = add ? (add.length ? add : [add]) : undefined;
    return add ? opts.concat(add) : opts;
  },

  loadEngines: function () {
    if (_.isNull(this.engines)) {
      decache('./engines.json');
      this.engines = require('./engines.json');
    }
    return this.engines;
  },

  loadPackage: function () {
    decache(this.packagePath);
    if (_.isNull(this.package)) {
      this.package = require(this.packagePath);
    }
    return this.package;
  }

}