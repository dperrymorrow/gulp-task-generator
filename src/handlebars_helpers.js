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

