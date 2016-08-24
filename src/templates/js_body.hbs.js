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
    {{#if jsConcat}}
    .pipe(gulp.dest('{{tasks.js.dest}}'))
    .pipe(concat('{{jsFile}}'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    {{/if}}
    {{#if babel}}
    .pipe(babel({presets: ['es2015']}))
    {{/if}}
    .pipe(gulp.dest('{{tasks.js.dest}}'))
    .pipe(notify('js task finished'))
});