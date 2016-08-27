"use strict";

const exec = require('child_process').exec;
const GulpBuilder = require('../src/gulp_builder');
const answers = require('./support/answers');

// stub out make dirs so that does not happen in our suite
class Builder extends GulpBuilder {
  makeDirs() {}
}

describe("Gulpfile Builder", () => {

  it(`should have gulpfile`, (done) => {
    new Builder(answers);

    exec('gulp js', (error, stdout, stderr) => {
      if (error) console.log(error);
      done();
    });
  });

});