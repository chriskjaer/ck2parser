'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');


gulp.task('test', function () {
  return gulp.src('./test/*.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('default', ['test'], function() {
  gulp.watch('./test/**/*.js', ['test']);
});
