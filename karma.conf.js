// Copyright (c) 2015 Thali, Inc.  All rights reserved.
'use strict';

module.exports = function(config) {

   var configuration = {
      autoWatch : false,

      frameworks: ['jasmine'],

      ngHtml2JsPreprocessor: {
         stripPrefix: 'src/',
         moduleName: 'gulpAngular'
      },

      browsers : ['PhantomJS'],

      plugins : [
         'karma-phantomjs-launcher',
         'karma-chrome-launcher',
         'karma-jasmine',
         'karma-ng-html2js-preprocessor',
         'karma-coverage'
      ],

      preprocessors: {
         'src/**/*.html': ['ng-html2js'],
         'src/modules/**/*.js': ['coverage']
      },

      reporters: ['progress'],


      // optionally, configure the reporter
      coverageReporter: {
         type : 'lcov',
         dir : 'coverage/'
      }
   };

   // This block is needed to execute Chrome on Travis
   // If you ever plan to use Chrome and Travis, you can keep it
   // If not, you can safely remove it
   // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
   if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
      configuration.customLaunchers = {
         'chrome-travis-ci': {
            base: 'Chrome',
            flags: ['--no-sandbox']
         }
      };
      configuration.browsers = ['chrome-travis-ci'];
   }

  config.set(configuration);
};
