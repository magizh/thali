'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');
module.exports = function(options) {
   function listFiles (callback) {
      var bowerDeps = wiredep({
         directory: 'bower_components',
         dependencies: true,
         devDependencies: true
      });

      var specFiles = [
         options.src + '/**/*.spec.js',
         options.src + '/**/*.mock.js'
      ];

      var htmlFiles = [
         options.src + '/**/*.html'
      ];

      var srcFiles = [
         options.libs + '/**/*.js',
         options.src + '/**/*.module.js',
         options.src + '/**/*.js'
      ].concat(specFiles.map(function(file) {
         return '!' + file;
      }));


      gulp.src(srcFiles)
         .pipe(concat(function(files) {
         callback(bowerDeps.js
            .concat(_.pluck(files, 'path'))
            .concat(htmlFiles)
            .concat(specFiles));
      }));
   }

   function runTests (singleRun, reporters, browsers, done) {
      listFiles(function(files) {
         karma.server.start({
           configFile: __dirname + '/../karma.conf.js',
           files: files,
           singleRun: singleRun,
           reporters: reporters,
           browsers: browsers
         }, done);
      });
   }

   gulp.task('test', ['scripts'], function(done) {
      var reporters = ['progress', 'coverage'];
      var browsers = ['PhantomJS'];
      runTests(true, reporters, browsers, done);
   });

   // Run this to set break points in browser.
   // Excluding coverage here as its not required and also it
   // causes the js files to get minified and annotated.
   gulp.task('test:debug', ['scripts'], function(done) {
      var reporters = ['progress'];
      var browsers = ['Chrome'];
      runTests(false, reporters, browsers, done);
   });
};
