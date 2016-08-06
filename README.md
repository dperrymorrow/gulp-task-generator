
# Gulp Task Generator

![gulp-task-generator](https://raw.githubusercontent.com/dperrymorrow/gulp-task-generator/master/gulp_generator_logo.png)

A command line tool that builds your gulpfile to your exact needs by asking you a series of questions.

## Supported Tasks

- Jade
- EJS
- Less
- Sass
- Stylus
- Autoprefix
- Coffescript
- Babel
- Concatenation
- Uglify
- Sourcemaps


 ```
 $ npm install gulp-task-generator -g
 ```

now change directories to your project and run the setup

```
 $ gulp-task-generator
```

Gulp-Task-Generator will now ask you a series of questions about your project and build your gulpfile.js accordingly.

```bash
$ gulp-task-generator
------------------------------- QUESTIONS -------------------------------
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
? Would you like to use a template engine for HTML? Yes
? Which HTML template engine would you like to use? jade
? Where are your .jade source files? source/jade
? Where do you want your compiled HTML (generated) files? build/
------------------------- CREATING DIRS & FILES -------------------------
/source/coffee => created
/build/js => created
/source/less => created
/build/css => created
/source/jade => created
/build/ => created
gulpfile.js => created
------------------------ INSTALLING DEPENDENCIES ------------------------
> Installing the NPM packages based on your choices.

\generator-test@1.0.0 /Users/dperrymorrow/builds/generator-test
├── gulp@3.9.1
├── gulp-autoprefixer@3.1.0
├── gulp-babel@6.1.2
├── gulp-clean-css@2.0.12
├── gulp-coffee@2.3.2
├── gulp-concat@2.6.0
├── gulp-jade@1.1.0
├── gulp-jshint@2.0.1
├── gulp-less@3.1.0
├── gulp-notify@2.2.0
├── gulp-plumber@1.1.0
├── gulp-rename@1.2.2
├── gulp-sourcemaps@1.6.0
├── gulp-uglify@1.5.4
└── jshint@2.9.2

> All NPM packages have been installed.
To use your new Gulp tasks:
$ npm install -g gulp
$ gulp
```

The packages needed to run your gulpfile have been added to your npm package.json file as dependencies, and have been installed via ``npm install``

## Usage

```bash
$ npm install -g gulp
$ gulp
```

## gulpfile.js

The above choices would have resulted in the following ``gulpfile.js``

```javascript
/*
=================================================
gulpfile.js created with Gulp-Task-Generator
https://www.npmjs.com/package/gulp-task-generator

To regenerate this file:
$ cd {this dir}
$ npm install -g gulp-task-generator
$ gulp-task-generator
=================================================
*/

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

const jade = require('gulp-jade');

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

gulp.task('html', () => {
  gulp.src(['source/jade/**/*.jade'])
    .pipe(plumber({
      handleError: err => {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(jade())
    .pipe(gulp.dest('build/'))
});

gulp.task('default', ["js","css","html"], () => {
  gulp.watch('source/coffee/**/*.coffee', ['js']);
  gulp.watch('source/less/**/*.less', ['css']);
  gulp.watch('source/jade/**/*.jade', ['html']);
});
```

You can then invoke the tasks with ``$ gulp`` or run individual gulp tasks.

And, of course you can edit your gulpfile.js further for more customization, it is your gulpfile after all, Gulp-Generator just helps you build it.

## Contributing

- fork the repo
- npm install

To test, from a test directory,

```bash
node ../gulp-task-generator/bin/cli.js
```



