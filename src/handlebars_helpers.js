"use strict";
const Handlebars = require('handlebars');

Handlebars.registerHelper('if_eq', (a, b, opts) => {
  a = typeof a == 'string' ? a.toLowerCase() : a;
  if (a === b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

Handlebars.registerHelper('if_or', function(elem1, elem2, options) {
  if (Handlebars.Utils.isEmpty(elem1) && Handlebars.Utils.isEmpty(elem2)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});