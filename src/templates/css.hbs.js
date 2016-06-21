gulp.task('css', () => {
  gulp.src(['{{cssSource}}/**/*.{{cssExt}}'])
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
    .pipe(gulp.dest('{{cssDest}}'))
    {{#if cssMin}}
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCss())
    {{/if}}
    {{#if cssProcessor}}
    .pipe(sourcemaps.write())
    {{/if}}
    .pipe(gulp.dest('{{cssDest}}'))
    .pipe(notify('css task finished'))
});
