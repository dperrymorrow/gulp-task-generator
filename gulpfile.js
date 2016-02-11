
var gulp = require('gulp');
var less = require('gulp-less');
var print = require('gulp-print');
var jade = require('gulp-jade');



// compiling less files
gulp.task('less', function () {
  return gulp.src('source/less/**/*.less')
    .pipe(less({
      paths: ['source/less/includes']
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(print());
});
// hi there... im jade