angular.module('starter.services', ['ngResource'])

.factory('Parties', function ($resource, ApiEndpoint) {
    return $resource(ApiEndpoint + '/parties.json');
})

.factory('Results', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/votes/results/1.json');
})

.factory('GetUserID', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/connect/user/' + $sessionStorage.fbuid + '.json');
})

.factory('UserVote', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/votes/' + $sessionStorage.uid + '.json');
})

.factory('Results', function ($resource, ApiEndpoint) {
    return $resource(ApiEndpoint + '/votes/results/1.json');
})

.factory('FeedFlat', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/stream/flat/' + $sessionStorage.uid + '.json');
})

.factory('FeedUser', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/stream/user/' + $sessionStorage.uid + '.json');
})

.factory('FeedPost', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/stream/post/' + $sessionStorage.uid + '.json');
})

.factory('PushWoosh', function($q, $state) {

    var PW_APP_ID = "50DBB-3F2B6";
    var pushNotification;

    function initPW(pushwooshAppId) {
      pushwooshAppId = PW_APP_ID;
      pushNotification = window.plugins.pushNotification;

      // Initialize the plugin
      pushNotification.onDeviceReady({ pw_appid: pushwooshAppId });

      //reset badges on app start
      pushNotification.setApplicationIconBadgeNumber(0);
    }

    var pw = {
      init: function(pushwooshAppId) {
        if (window.ionic.Platform.isIOS()) {
          initPW(pushwooshAppId);
        } else {
          console.warn('[ngPushWoosh] Unsupported platform');
        }
      },

      registerDevice: function() {
        var deferred = $q.defer();
        if (window.ionic.Platform.isIOS()) {
          pushNotification.registerDevice(deferred.resolve, deferred.reject);
        } else {
          console.warn('[ngPushWoosh] Unsupported platform');
          deferred.resolve(false);
        }
        return deferred.promise;
      },

      unregisterDevice: function() {
        var deferred = $q.defer();
        pushNotification.unregisterDevice(deferred.resolve, deferred.reject);
        return deferred.promise;
      }
    };

    return pw;
  });

  