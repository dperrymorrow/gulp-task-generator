var Handlebars = require('handlebars');

Handlebars.registerHelper('if_eq', function (a, b, opts) {
  a = typeof a == 'string' ? a.toLowerCase() : a;
  if (a === b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});