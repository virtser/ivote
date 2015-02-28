var uid = 0;
// var serverPrefix = "https://ivoteorgil.herokuapp.com/client";

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services']);
// angular.module('ionicApp', ['ionic'])

app.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // ttvote: openFB.init({appId: '788436027893381'});
  // openFB.init({appId: '1557020157879112'});

  $stateProvider
    .state('signin', {
      url: "/sign-in",
      templateUrl: "templates/sign-in.html",
      controller: 'SignInCtrl'
    })
    .state('tabs', {
      url: "/tabs",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tabs.results', {
      url: '/results',
      views: {
        'tabs-results': {
          templateUrl: 'templates/results-friends.html',
          controller: 'ResultsFriendsCtrl'
        }
      }
    })
    .state('tabs.result-me', {
      url: '/results/me',
      views: {
        'tabs-results': {
          templateUrl: 'templates/results-me.html',
          controller: 'ResultsMeCtrl'
        }
      }
    })
    .state('tabs.result-friends', {
      url: '/results/friends',
      views: {
        'tabs-results': {
          templateUrl: 'templates/results-friends.html',
          controller: 'ResultsFriendsCtrl'
        }
      }
    })
    .state('tabs.feed-me', {
        url: '/feed/me',
        views: {
          'tabs-feed': {
            templateUrl: 'templates/tabs-feed-me.html',
            controller: 'FeedUserCtrl'
          }
        }
    })
    .state('tabs.feed-friends', {
        url: '/feed/friends',
        views: {
          'tabs-feed': {
            templateUrl: 'templates/tabs-feed-friends.html',
            controller: 'FeedFlatCtrl'
          }
        }
    })

   $urlRouterProvider.otherwise("/sign-in");

})
