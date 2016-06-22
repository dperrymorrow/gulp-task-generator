#!/usr/bin/env node
"use strict";

const Quiz = require('./../src/quiz');
// npm.load(function (err) {
const quizInst = new Quiz(process.argv.slice(2));
// });

