"use strict";

const PackageBuilder = require('../src/package_builder');
const libs = require('../src/dependencies');
const answers = require('./support/answers');

const noDeps = [
  'js', 'jsSource', 'jsDest', 'jsFile',
  'html', 'htmlSource', 'htmlDest', 'cssFile',
  'css', 'cssSource', 'cssDest'
];

// dont want to npm install in our test suite
class Builder extends PackageBuilder {
  install() {}
}

describe("Package Builder", () => {

  beforeEach(() => {

  });

  describe("checking dependancies and packages", () => {
    let builder = new Builder(answers);

    for (let key in answers) {
      if (!noDeps.includes(key)) {
        key = typeof answers[key] === 'boolean' ? key : answers[key];

        it(`should have packages for ${key}`, () => {
          if (typeof libs[key] == 'object') {
            libs[key].forEach(lib => {
              expect(builder.packages).toContain(lib);
            });
          } else {
            expect(builder.packages).toContain(libs[key]);
          }
        });
      }
    }
  });
});