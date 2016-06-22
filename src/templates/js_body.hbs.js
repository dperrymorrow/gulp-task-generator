gulp.task('js',function(){
  gulp.src(['{{jsSrc}}/**/*.js'])
    .pipe(plumber({
      handleError: (err) => {
        console.log(err);
        this.emit('end');
      }
    }))
    {{#if coffeeScript}}
    .pipe(coffee({bare: true})
    {{/if}}
    {{#if jsHint}}
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    {{/if}}
    // .pipe(browserify())
    .pipe(gulp.dest('{{jsDest}}'))
    {{#if jsConcat}}
    .pipe(concat('{{jsFile}}'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    {{/if}}
    {{#if babel}}
    .pipe(babel())
    {{/if}}
    .pipe(gulp.dest('{{jsDest}}'))
    .pipe(notify('js task finished'))
});