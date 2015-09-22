'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
   pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function(options) {
   gulp.task('partials', function () {
      return gulp.src([
         options.src + '/**/*.html',
         options.tmp + '/serve/**/*.html'
      ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: 'thali'
      }))
      .pipe(gulp.dest(options.tmp + '/partials/'));
   });

   gulp.task('html', ['inject', 'partials'], function () {
      var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', { read: false });
      var partialsInjectOptions = {
         starttag: '<!-- inject:partials -->',
         ignorePath: options.tmp + '/partials',
         addRootSlash: false
      };

      var htmlFilter = $.filter('*.html');
      var jsFilter = $.filter('**/*.js');
      var cssFilter = $.filter('**/*.css');
      var assets;

      return gulp.src(options.tmp + '/serve/*.html')
         .pipe($.inject(partialsInjectFile, partialsInjectOptions))
         .pipe(assets = $.useref.assets())
         .pipe($.rev())
         .pipe(jsFilter)
         .pipe($.ngAnnotate())
         .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', options.errorHandler('Uglify'))
         .pipe(jsFilter.restore())
         .pipe(cssFilter)
         .pipe($.csso())
         .pipe(cssFilter.restore())
         .pipe(assets.restore())
         .pipe($.useref())
         .pipe($.revReplace())
         .pipe(htmlFilter)
         .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
         }))
         .pipe(htmlFilter.restore())
         .pipe(gulp.dest(options.dist + '/'))
         .pipe($.size({ title: options.dist + '/', showFiles: true }));
   });

   // Assets
   gulp.task('assets', function () {
      return gulp.src([
         options.src + '/assets/**/*'
      ])
      .pipe(gulp.dest(options.dist + '/assets'));
   });

   gulp.task('clean', function (done) {
      $.del([options.dist + '/', options.tmp + '/', options.coverage], done);
   });

   // TODO - integrate this into existing assets copy function.
   gulp.task('moveLibs', function () {
      var excludePrefix = '!' + options.libs;
      var files = [
            options.libs + '/**/*'
         ];
      return gulp.src(files)
         .pipe(gulp.dest(options.dist + '/libs'));
   });

   // Create a tar of web-ui folder
   gulp.task('createTar', function (argument) {
      return gulp.src('dist/**/*')
         .pipe($.tar('thali.tar'))
         .pipe(gulp.dest('.'));
   });

   gulp.task('build', function() {
      $.runSequence('clean', 'html' , 'assets', 'moveLibs',  'createTar');
   });
};
