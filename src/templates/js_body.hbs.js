gulp.task('js', () => {
  gulp.src(['{{tasks.js.src}}/**/*.{{tasks.js.ext}}'])
    .pipe(plumber({
      handleError: (err) => {
        console.log(err);
        this.emit('end');
      }
    }))
    {{#if coffeeScript}}
    .pipe(coffee({bare: true}))
    {{/if}}
    {{#if jsHint}}
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    {{/if}}
    .pipe(gulp.dest('{{tasks.js.dest}}'))
    {{#if jsConcat}}
    .pipe(concat('{{jsFile}}'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    {{/if}}
    {{#if babel}}
    .pipe(babel())
    {{/if}}
    .pipe(gulp.dest('{{tasks.js.dest}}'))
    .pipe(notify('js task finished'))
});