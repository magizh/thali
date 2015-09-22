// Copyright (c) 2015 Thali, Inc.
(function() {
   'use strict';

   angular
      .module('thali')
      .config(configure);
      // Configure Routes for ui-view
      function configure($stateProvider, $urlRouterProvider) {

         // For any unmatched url, redirect to home
         $urlRouterProvider.otherwise('/');

         $stateProvider
            .state('home', {
               url: '/',
               templateUrl: 'modules/home/home.html',
               controller: 'HomeController as homeCtrl'
            });
      }
})();
