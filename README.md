
# Gulp Generator

A command line tool that builds your gulpfile to your exact needs by asking you a series of questions. You can build a full static site generator with dev server, or a simple build tool for pre-processing assets and preparing them for deployment.

 ```
 $ npm install gulp-generator -g
 ```

now change directories to your project and run the setup

```
 $ gulp-generator
```

Gulp-Generator will now ask you a series of questions about your project and build your gulpfile.js accordingly.

```bash
$ gulp-generator
> Running Gulp-Generator in /Users/dperrymorrow/builds/generator-test
? You already have a Gulpfile.js. Overwrite? Yes
? Would you like to run CSS tasks? Yes
? Which CSS pre-processor would you like to use? less
? Would you like to autoprefix your CSS? Yes
? Would you like your CSS minified? Yes
? Would you like your CSS files concatenated? Yes
? Name of your concatenated CSS file? main.css
? Where are your CSS source files? source/less
? Where do you want your compiled CSS (generated) files? build/css
? Would you like to run Javascript tasks? Yes
? Will you be using Coffeescript? Yes
? Convert ES6 to ES5? Yes
? Would you like to run JsHint on your Javascript? Yes
? Would you like to concatenate and minify your Javascript? Yes
? Name of your concatenated js file? main.js
? Where are your .coffee source files? source/coffee
? Where do you want your compiled Javascript (generated) files? build/js

Gulpfile.js has been created

/Users/dperrymorrow/builds/generator-test/source/coffee created.
/Users/dperrymorrow/builds/generator-test/build/js created.
/Users/dperrymorrow/builds/generator-test/source/less created.
/Users/dperrymorrow/builds/generator-test/build/css created.

> Installing the NPM packages based on your choices.
> All NPM packages have been installed.
```

The packages needed to run your gulpfile have been added to your npm package.json file as dependencies, and have been installed via ``npm install``

The above choices would have resulted in the following ``gulpfile.js``

## gulpfile.js

```javascript
"use strict";
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoPrefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const less = require('gulp-less');

const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const coffee = require('gulp-coffee');
const babel = require('gulp-babel');


gulp.task('css', () => {
  gulp.src(['source/less/**/*.less'])
    .pipe(plumber({
      handleError: err => {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoPrefixer())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(notify('css task finished'))
});

gulp.task('js', () => {
  gulp.src(['source/coffee/**/*.coffee'])
    .pipe(plumber({
      handleError: (err) => {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(coffee({bare: true}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('build/js'))
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(babel())
    .pipe(gulp.dest('build/js'))
    .pipe(notify('js task finished'))
});

gulp.task('default', ["js","css"], () => {
  gulp.watch('source/coffee/**/*.coffee', ['js']);
  gulp.watch('source/less/**/*.less', ['css']);
});
```

You can then invoke the tasks with ``gulp`` or run individual gulp tasks.

And, of course you can edit your gulpfile.js further for more customization, it is your gulpfile after all, Gulp-Generator just helps you build it.




