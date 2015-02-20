angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
// angular.module('ionicApp', ['ionic'])

.run(function($ionicPlatform) {
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

  openFB.init({appId: '788436027893381'});

  $stateProvider
    .state('signin', {
      url: "/sign-in",
      templateUrl: "sign-in.html",
      controller: 'SignInCtrl'
    })
    .state('tabs', {
      url: "/tabs",
      abstract: true,
      templateUrl: "tabs.html"
    })
  .state('tabs.dash', {
    url: '/dash',
    views: {
      'tabs-dash': {
        templateUrl: 'templates/tabs-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tabs.chats', {
      url: '/chats',
      views: {
        'tabs-chats': {
          templateUrl: 'templates/tabs-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "nav-stack.html"
        }
      }
    })

   $urlRouterProvider.otherwise("/sign-in");

})
