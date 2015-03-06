var uid = 0;
// var serverPrefix = "https://ivoteorgil.herokuapp.com/client";

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.utils']);
// angular.module('ionicApp', ['ionic'])

app.run(function($ionicPlatform, $rootScope, $state, ApiEndpoint, PushWoosh, DLog) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    PushWoosh.init();
  });
})

.value('ApiEndpoint', 'http://localhost:8100/api')

.config(function($stateProvider, $urlRouterProvider) {

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
    .state('tabs.feed', {
      url: '/feed',
      views: {
        'tabs-feed': {
          templateUrl: 'templates/tabs-feed-friends.html',
          controller: 'FeedFlatCtrl'
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
    .state('tabs.feed-post', {
        url: '/feed/post',
        views: {
          'tabs-feed': {
            templateUrl: 'templates/tabs-feed-post.html',
            controller: 'FeedPostCtrl'
          }
        }
    })
    .state('tabs.results-share', {
        url: '/results/share',
        views: {
          'tabs-results': {
            templateUrl: 'templates/share.html',
            controller: 'ShareCtrl'
        }
      }
    })

   $urlRouterProvider.otherwise("/sign-in");

})
