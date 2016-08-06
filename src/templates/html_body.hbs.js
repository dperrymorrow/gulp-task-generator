gulp.task('html', () => {
  gulp.src(['{{tasks.html.src}}/**/*.{{tasks.html.ext}}'])
    .pipe(plumber({
      handleError: err => {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe({{htmlProcessor}}())
    .pipe(gulp.dest('{{tasks.html.dest}}'))
});