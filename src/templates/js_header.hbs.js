{{#if jsHint}}
const jshint = require('gulp-jshint');
{{/if}}
{{#if jsConcat}}
const uglify = require('gulp-uglify');
{{/if}}
{{#if coffeeScript}}
const coffee = require('gulp-coffee');
{{/if}}
{{#if babel}}
const babel = require('gulp-babel');
{{/if}}