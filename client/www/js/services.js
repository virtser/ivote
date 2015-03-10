angular.module('starter.services', ['ngResource'])

.factory('Parties', function ($resource, ApiEndpoint) {
    return $resource(ApiEndpoint + '/parties.json');
})

.factory('Results', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/votes/results/' + $sessionStorage.uid + '.json');
})

.factory('GetUserID', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/connect/user/' + $sessionStorage.fbuid + '.json');
})

.factory('UserVote', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/votes/' + $sessionStorage.uid + '.json');
})

.factory('FeedParty', function ($resource, $sessionStorage, ApiEndpoint) {
    return $resource(ApiEndpoint + '/stream/party/' + $sessionStorage.my_vote_party + '.json');
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

.factory('DLog', function($q, $state) {
    var dcons = {
      log: function() {
//        console.log( Array.prototype.slice.call(arguments) );
      }
    };
    return dcons;
})

.factory('PushWoosh', function($q, $state, $cordovaToast) {

    var PW_APP_ID = "50DBB-3F2B6";
    var pushNotification;

    function initPW_iOS(pushwooshAppId) {
        pushwooshAppId = PW_APP_ID;
        pushNotification = window.plugins.pushNotification;

        //set push notification callback before we initialize the plugin
        document.addEventListener('push-notification', function(event) {
                                //get the notification payload
                                var notification = event.notification;

                                //display alert to the user for example
                                alert(notification.aps.alert);

                                //clear the app badge
                                pushNotification.setApplicationIconBadgeNumber(0);
                            });

        // Initialize the plugin
        pushNotification.onDeviceReady({ pw_appid: pushwooshAppId });

        //reset badges on app start
        pushNotification.setApplicationIconBadgeNumber(0);
    }

    function initPW_Android(pushwooshAppId) {
        pushwooshAppId = PW_APP_ID;
        pushNotification = window.plugins.pushNotification;

        //set push notification callback before we initialize the plugin
        document.addEventListener('push-notification', function(event) {
            var title = event.notification.title;
            var userData = event.notification.userdata;

            if(typeof(userData) != "undefined") {
                console.warn('user data: ' + JSON.stringify(userData));
            }

            $cordovaToast.showLongCenter(title);
        });

        // Initialize the plugin
        pushNotification.onDeviceReady({ projectid:802918675498, pw_appid : pushwooshAppId });

        //reset badges on app start
        pushNotification.setApplicationIconBadgeNumber(0);
    }

    var pw = {
      init: function(pushwooshAppId) {
        if (window.ionic.Platform.isIOS()) {
          initPW_iOS(pushwooshAppId);
        } else if (window.ionic.Platform.isAndroid()) {
          initPW_Android(pushwooshAppId);
        } else {
          console.warn('[ngPushWoosh] Unsupported platform');
        }
      },

      registerDevice: function() {
        var deferred = $q.defer();
        if (window.ionic.Platform.isIOS()) {
          pushNotification.registerDevice(deferred.resolve, deferred.reject);
        } else if (window.ionic.Platform.isAndroid()) {
          pushNotification.registerDevice(deferred.resolve, deferred.reject);
        } else {
          console.warn('[ngPushWoosh] Unsupported platform');
          deferred.reject("Push not supported on this platform");
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

