angular.module('starter.controllers', ['ngStorage', 'ngCookies', 'ngCordova', 'starter.utils'])

.controller('SignInCtrl', function($scope, $state, $http, $sessionStorage, $cookies, ApiEndpoint, PushWoosh, $localstorage) {

    function connectToOurServer(authToken, devToken) {
            console.log("calling our server with authToken = " + authToken + " devToken = " + devToken);
            $http({
                method: 'POST',
                url: ApiEndpoint + '/connect',
                headers: {
                   'Content-Type': "application/x-www-form-urlencoded"
                },
                data: authToken+devToken,
                timeout: 30000
            })
            .success(function(data, status, headers, config) {
                $sessionStorage.uid = data.id;
                $localstorage.set('uid', data.id);
                $http.get(ApiEndpoint + '/votes/user/'+data.id+'.json').
                  success(function(data, status, headers, config) {
                    if (data.length > 0) {
                        $sessionStorage.my_vote_id = data[0].id;
                        $sessionStorage.my_vote_party = data[0].party_id;
                    }
                    console.log("i last voted for: "+$sessionStorage.my_vote_id);

                    if ($sessionStorage.my_vote_id != null)
                      $state.go('tabs.result-friends');
                    else
                      $state.go('tabs.result-me');
                  }).
                  error(function(data, status, headers, config) {
                    $state.go('tabs.result-me');
                  });
            })
            .error(function(data, status, headers, config) {
                console.log('call to our server fails. stat=' + status);
                $state.go('signin');
            });
    }

    console.log("localstorage token = " + $localstorage.get('fb_token'));
    console.log("localstorage uid = " + $localstorage.get('uid'));
    if ($localstorage.get('fb_token') != null && ($localstorage.get('uid') != null)) {
        $sessionStorage.uid = $localstorage.get('uid');
        console.log('Auto login');
        connectToOurServer('token='+$localstorage.get('fb_token'), "");
        // $state.go('tabs.result-me');
    }

    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            $state.go('tabs.home');
        }
        var expDate = new Date(
            new Date().getTime() + response.authResponse.expiresIn * 1000
        ).toISOString();

        var authData = {
            id: String(response.authResponse.userID),
            access_token: response.authResponse.accessToken,
            expiration_date: expDate
        }
        console.log(response);

        console.log('Got Token: ' + response.authResponse.accessToken);
        console.log("Api Endpoint = " + ApiEndpoint);
        $localstorage.set('fb_token', response.authResponse.accessToken)

        PushWoosh.registerDevice()
        .then(function(result) {
            console.log("Pushwoosh result2: ", result);
            var devToken = "";
            if (window.ionic.Platform.isIOS()) {
                devToken = "&device_token=" + result['deviceToken'];
                console.warn('iOS push device token: ' + result['deviceToken']);
            }
            else if (window.ionic.Platform.isAndroid()) {
                devToken = "&device_token=" + result;
                console.warn('Android push token: ' + result);
            }
            else {
              console.warn('[ngPushWoosh] Unsupported platform');
            }
            connectToOurServer('token='+response.authResponse.accessToken, devToken);
        }, function(reason) {
                console.log('PushWoosh.registerDevice fails. reason=' + reason);
            connectToOurServer('token='+response.authResponse.accessToken, "");
        });

    };

    var fbLoginError = function(error){
        alert("error: " + error);
    };

    $scope.newLogin = function() {
        console.log('Login');
        if (!window.cordova) {
            facebookConnectPlugin.browserInit('1557020157879112');
        }
        facebookConnectPlugin.login(['public_profile, user_friends, email'], fbLoginSuccess, fbLoginError);
    };

  $scope.signIn = function() {
    console.log('Sign-In');
    $state.go('tabs.home');
  };

})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
})

.controller('ResultsMeCtrl', ['$scope', '$state', 'Parties', '$sessionStorage', function($scope, $state, Parties, $sessionStorage) {
    $scope.indexCtrl= 16;
    
    $scope.showMore = function() {
      $scope.indexCtrl = 25;
      console.log(" $scope.ctrIndex ",  $scope.ctrIndex = 25);
   };

    $scope.parties = Parties.query();
    $scope.user_id = $sessionStorage.uid;
    $scope.my_vote_id = $sessionStorage.my_vote_id;
    $scope.my_vote_party = $sessionStorage.my_vote_party;
    $scope.$on('vote:updated', function(event,data) {
        console.log("vote:updated: " + JSON.stringify(data));
        $scope.my_vote_id = data.id;
        $scope.my_vote_party = $sessionStorage.my_vote_party;
        console.log("vote updated after apply: " + $scope.my_vote_id);
        $state.go('tabs.result-friends');
    });
}])

.controller('ResultsFriendsCtrl', function($scope, $cordovaSocialSharing, Results, Parties) {
  $scope.parties = Parties.query(function(){
    $scope.results = Results.query(function(){
      var total_number_of_votes = 0;
      $scope.totalSelected = 0;
      angular.forEach($scope.results, function(value, key) {
        total_number_of_votes += value.number_of_votes;
        angular.forEach($scope.parties, function(party, index) {
          if (value.party_id == party.id)
            value.name = party.name;
        })
        // console.log(value);
      });
      $scope.toggleItem = function (result) {
        var seats = result.number_of_votes / $scope.results.total_number_of_votes * 120;
        result.selected = !result.selected;
        $scope.totalSelected += seats * (result.selected ? 1 : -1);
        $scope.selectedPercents = $scope.totalSelected * 100 / 120;
      };
      $scope.results.total_number_of_votes = total_number_of_votes;
    });
  });

  $scope.shareAnywhere = function(message, subject) {
      console.log("Message: " + message + ", subject: " + subject);
      $cordovaSocialSharing.share(message, subject, "../img/ivote-logo.png", "https://ivote.org.il");
  }    
})

.controller('ConfirmVoteCtrl', function($scope, $rootScope, $ionicModal, $http, $sessionStorage, Parties, ApiEndpoint) {
  $ionicModal.fromTemplateUrl('templates/confirm-vote-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(pid) {
    console.log("pid = " + pid);
    $scope.parties = Parties.query();
    $scope.pid = pid;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.confirmVote = function() {
        console.log("confirm vote party = " + $scope.parties[$scope.pid].id);
        console.log("confirm vote my_vote_id = " + $sessionStorage.my_vote_id);
        if ($sessionStorage.my_vote_id > 0) {
            meth = 'PUT';
            url = ApiEndpoint + '/votes/'+$sessionStorage.my_vote_id+'.json'
        }
        else {
            meth = 'POST';
            url = ApiEndpoint + '/votes.json';
        }
        console.log("user id = " + $sessionStorage.uid);
        console.log("party id = "+ $scope.parties[$scope.pid].id);
        var vote_data = { vote : {
                user_id : $sessionStorage.uid,
                party_id : $scope.parties[$scope.pid].id
                }
            };
        $http({
            method: meth,
            url: url,
            headers: {
               'Content-Type': "application/json"
            },
            data: vote_data
        })
        .success(function(data, status, headers, config) {
            $sessionStorage.my_vote_party = $scope.parties[$scope.pid].id;
            $rootScope.$broadcast('vote:updated',data);
            $scope.modal.hide();
        })
        .error(function(data, status, headers, config) {
            console.log('vote fails');
            $scope.modal.hide();
        });
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

.controller('FeedFlatCtrl', function($scope, FeedFlat) {
  $scope.feedData = FeedFlat.query();
})

.controller('FeedUserCtrl', function($scope, $sessionStorage, Parties, FeedUser) {
  $scope.feedData = FeedUser.query();
})

.controller('FeedPostCtrl', function($scope, $state, $http, $sessionStorage) {

  $scope.postToFeed = function() {
    console.log('Post to Feed of '+ $sessionStorage.uid +', text: ' + $scope.text);

    if ($scope.text != '' && $scope.text != 'undefined') {

      var post_data = '{ "text" : "' + $scope.text + '" }';

      meth = 'POST';
      url = '/api/stream/post/'+ $sessionStorage.uid +'.json'

      $http({
          method: meth,
          url: url,
          headers: {
             'Content-Type': "application/json"
          },
          data: post_data
      })
      .success(function(data, status, headers, config) {
          console.log("post success: " + data);
          $state.go('tabs.feed-friends');
      })
      .error(function(data, status, headers, config) {
          console.log('post failed!');
      })
    }
  }

})

.controller('IntegrityCtrl', function($scope, $state, $http, $sessionStorage, $cookies, $localstorage) {
    if ($localstorage.get('fb_token', null) == null || ($sessionStorage.uid == null)) {
        console.log('Bad integrity. Logging out.');
        $state.go('signin');
    }
})
