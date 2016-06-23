gulp.task('css', () => {
  gulp.src(['{{tasks.css.src}}/**/*.{{tasks.css.ext}}'])
    .pipe(plumber({
      handleError: err => {
        console.log(err);
        this.emit('end');
      }
    }))
    {{#if cssProcessor}}
    .pipe(sourcemaps.init())
    .pipe({{cssProcessor}}())
    {{/if}}
    {{#if autoPrefix}}
    .pipe(autoPrefixer())
    {{/if}}
    {{#if cssConcat}}
    .pipe(concat('{{cssFile}}'))
    {{/if}}
    .pipe(gulp.dest('{{tasks.css.dest}}'))
    {{#if cssMin}}
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCss())
    {{/if}}
    {{#if cssProcessor}}
    .pipe(sourcemaps.write())
    {{/if}}
    .pipe(gulp.dest('{{tasks.css.dest}}'))
    .pipe(notify('css task finished'))
});
