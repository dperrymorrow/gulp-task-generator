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

Handlebars.registerHelper('stringifyKeys', item => {
  return JSON.stringify(Object.keys(item));
});

Handlebars.registerHelper('if_or', (elem1, elem2, options) => {
  if (Handlebars.Utils.isEmpty(elem1) && Handlebars.Utils.isEmpty(elem2)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});