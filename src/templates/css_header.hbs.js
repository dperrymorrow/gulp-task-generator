{{#if autoPrefix}}
const autoPrefixer = require('gulp-autoprefixer');
{{/if}}
{{#if cssMin}}
const cleanCss = require('gulp-clean-css');
{{/if}}
{{#if cssProcessor}}
const {{cssProcessor}} = require('gulp-{{cssProcessor}}');
{{/if}}