angular.module('starter.controllers', ['ngStorage'])

.controller('SignInCtrl', function($scope, $state, $http, $sessionStorage) {

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
        $sessionStorage.my_vote_id = 0;
        $sessionStorage.my_vote_party = 0;
        $sessionStorage.uid = 0;
        openFB.login(
            function(response) {
                if (response.status === 'connected') {
                    console.log('Got Token: ' + response.authResponse.token);
                    var msgdata = {
                            'token' : response.authResponse.token
                        };
                    $http({
                        method: 'POST',
                        url: '/api/connect',
                        headers: {
                           'Content-Type': "application/x-www-form-urlencoded"
                        },
                        data: 'token='+response.authResponse.token
                    })
                    .success(function(data, status, headers, config) {
                        $sessionStorage.uid = data.id;
                        $http.get('/api/votes/user/'+data.id+'.json').
                          success(function(data, status, headers, config) {
                            if (data.length > 0) {
                                $sessionStorage.my_vote_id = data[0].id;
                                $sessionStorage.my_vote_party = data[0].party_id;
                            }
                            console.log("i last voted for: "+$sessionStorage.my_vote_id);
                            $state.go('tabs.dash');
                          }).
                          error(function(data, status, headers, config) {
                            $state.go('tabs.dash');
                          });
                    })
                    .error(function(data, status, headers, config) {
                        console.log('call to our server fails');
                        $state.go('signin');
                    });
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

.controller('DashCtrl', ['$scope', 'LOCALParties', 'Parties', '$sessionStorage', function($scope, LOCALParties, Parties, $sessionStorage) {
    $scope.parties = Parties.query();
    $scope.user_id = $sessionStorage.uid;
    $scope.my_vote_id = $sessionStorage.my_vote_id;
    $scope.my_vote_party = $sessionStorage.my_vote_party;
    $scope.$on('vote:updated', function(event,data) {
        console.log("vote updated");
        $scope.my_vote_id = $sessionStorage.my_vote_id;
        $scope.my_vote_party = $sessionStorage.my_vote_party;
        console.log("vote updated after apply");
    });
}])

.controller('ChatsCtrl', function($scope, LocalResults) {
  $scope.results = LocalResults.all();
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
.controller('ResultsFriendsCtrl', function($scope,Results,LocalResults,Parties) {
  console.log('ResultsFriendsCtrl');
  $scope.parties = Parties.query(function(){
    console.log($scope.parties);
    $scope.results = Results.query(function(){
      var total_number_of_votes = 0;
      angular.forEach($scope.results, function(value, key) {
        total_number_of_votes += value.number_of_votes;
        angular.forEach($scope.parties, function(party, index) {
          if (value.party_id == party.id)
            value.name = party.name;
        })
        
        console.log(value);
      });
      $scope.results.total_number_of_votes = total_number_of_votes;
    });
    
  });
  
  
})
.controller('ResultsAreaCtrl', function($scope,LocalResults) {
 console.log('ResultsAreaCtrl');
 $scope.results = LocalResults.all();
})

.controller('ConfirmVoteCtrl', function($scope, $rootScope, $ionicModal, $http, $sessionStorage, Parties) {
  $ionicModal.fromTemplateUrl('my-modal.html', {
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
        console.log("party = "+$scope.parties[$scope.pid].id);
        if ($sessionStorage.my_vote_id > 0) {
            meth = 'PUT';
            url = '/api/votes/'+$sessionStorage.my_vote_id+'.json'
        }
        else {
            meth = 'POST';
            url = '/api/votes.json';
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
            console.log("vote success: " + data);
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
});

