"use strict";

const Builder = require('../src/package_builder');
const libs = require('../src/dependencies');
const answers = require('./support/answers');

const noDeps = [
  'css', 'js', 'html', 'cssDest', 'jsDest',
  'cssSource', 'jsSource', 'jsFile', 'cssFile'
];

describe("Package Builder", () => {

  beforeEach(() => {
    spyOn(Builder.prototype, 'install');
  });

  describe("checking dependancies and packages", () => {
    var builder = new Builder(answers);

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