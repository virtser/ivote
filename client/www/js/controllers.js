angular.module('starter.controllers', [])

.controller('SignInCtrl', function($scope, $state, $http) {

  $scope.logout = function () {
    openFB.revokePermissions(
        function() {
            alert('Permissions revoked');
        },
        function(error) {
            alert(error.message);
        }
    );

    openFB.fbLogout(
        function() {
            alert ('Facebook Logout Successful.');
        },
        function(error) {
            alert(error.message);
        }
    );
  }

    $scope.fbLogin = function() {
        openFB.login(
            function(response) {
                if (response.status === 'connected') {
                    console.log('Got Token: ' + response.authResponse.token);
                    var msgdata = {
                            'token' : response.authResponse.token
                        };
                    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                    $http({
                        method: 'POST',
                        url: '/api/connect',
                        data: 'token='+response.authResponse.token
                    })
                    .success(function(data, status, headers, config) {
                        console.log(data);
                        console.log('call to our server works');
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                        console.log('call to our server fails');
                    });
                    $state.go('tabs.dash');
                } else {
                    alert('Facebook login failed');
                    $state.go('tabs.home');
                }
            },
            {scope: 'public_profile, user_friends'});
    }

  $scope.signIn = function() {
    console.log('Sign-In');
    $state.go('tabs.home');
  };

})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
})

.controller('DashCtrl', function($scope, LOCALParties, Parties) {
    $scope.parties = Parties.query();
//    $scope.parties = LOCALParties.query();
})

.controller('ChatsCtrl', function($scope, Results) {
  $scope.results = Results.all();
  // $scope.remove = function(chat) {
  //   Chats.remove(chat);
  // }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('ResultsMeCtrl', function($scope,LOCALParties, Parties) {
  $scope.parties = Parties.query();
  console.log('ResultsMeCtrl');
})
.controller('ResultsFriendsCtrl', function($scope,Results) {
  console.log('ResultsFriendsCtrl');
  $scope.results = Results.all();
})
.controller('ResultsAreaCtrl', function($scope,Results) {
 console.log('ResultsAreaCtrl');
 $scope.results = Results.all();
})


.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
