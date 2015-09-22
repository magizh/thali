'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')({
   pattern: ['del']
});

function isOnlyChange (event) {
  return event.type === 'changed';
}

module.exports = function (options) {
   // Task to clean up the old css file in .tmp
   gulp.task('cleanCSS', function() {
      return $.del([options.tmp + '/serve/index.css']);
   });
   gulp.task('watch', ['inject'], function () {

      gulp.watch([options.src + '/*.html', 'bower.json'], ['inject']);

      gulp.watch([
         options.src + '/**/*.css',
         options.src + '/sass/**/*.scss'
         ], function (event) {
            if(isOnlyChange(event)) {
            gulp.start('cleanCSS', 'styles');
         } else {
           gulp.start('inject');
         }
      });

      gulp.watch(options.src + '/**/*.js', function(event) {
         if(isOnlyChange(event)) {
            gulp.start('scripts');
         } else {
            gulp.start('inject');
         }
      });

      gulp.watch(options.src + '/**/*.html', function(event) {
         browserSync.reload(event.path);
      });
  });
};
