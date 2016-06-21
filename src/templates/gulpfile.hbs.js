"use strict";
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
{{#if_or cssConcat jsConcat}}
const concat = require('gulp-concat');
{{/if_or}}
{{#if autoPrefix}}
const autoPrefixer = require('gulp-autoprefixer');
{{/if}}
{{#if cssMin}}
const cleanCss = require('gulp-clean-css');
{{/if}}
{{#if cssProcessor}}
const {{cssProcessor}} = require('gulp-{{cssProcessor}}');
{{/if}}

{{#if css}}
{{> css}}
{{/if}}

gulp.task('default', [{{#if css}}'css'{{/if}}], () => {
  {{#if css}}
  gulp.watch('{{cssSource}}/**/*.{{cssExt}}', ['css']);
  {{/if}}
});

