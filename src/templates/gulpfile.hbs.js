/*
=================================================
gulpfile.js created with Gulp-Task-Generator
https://www.npmjs.com/package/gulp-task-generator

To regenerate this file:
$ cd {this dir}
$ npm install -g gulp-task-generator
$ gulp-task-generator
=================================================
*/

"use strict";

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
{{#if_or cssConcat jsConcat}}
const concat = require('gulp-concat');
{{/if_or}}
{{#if css}}{{> cssHeader}}{{/if}}
{{#if js}}{{> jsHeader}}{{/if}}
{{#if html}}{{> htmlHeader}}{{/if}}

{{#if css}}{{> cssBody}}{{/if}}

{{#if js}}{{> jsBody}}{{/if}}

{{#if html}}{{> htmlBody}}{{/if}}

gulp.task('default', {{{stringifyKeys tasks}}}, () => {
	{{#each tasks}}
  gulp.watch('{{src}}/**/*.{{ext}}', ['{{@key}}']);
  {{/each}}
});
