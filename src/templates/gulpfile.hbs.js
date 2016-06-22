"use strict";
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
{{#if_or cssConcat jsConcat}}
const concat = require('gulp-concat');
{{/if_or}}
{{> cssHeader}}
{{> jsHeader}}

{{> cssBody}}

{{> jsBody}}

gulp.task('default', [{{#if css}}'css'{{/if}}], () => {
  {{#if css}}
  gulp.watch('{{cssSource}}/**/*.{{cssExt}}', ['css']);
  {{/if}}
});

