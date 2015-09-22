'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var autoprefixer = require('autoprefixer-core');
var wiredep = require('wiredep').stream;

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
   gulp.task('styles', function () {
      var sassOptions = {
         style: 'expanded'
      };

      return gulp.src([
         options.src + '/sass/index.scss'
      ])
      .pipe($.sourcemaps.init())
      .pipe($.sass(sassOptions)).on('error', options.errorHandler('Sass'))
      .pipe($.postcss([ autoprefixer({ browsers: ['last 2 versions'] })]))
            .on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.tmp + '/serve/'))
      .pipe(browserSync.reload({ stream: true }));
   });
};
