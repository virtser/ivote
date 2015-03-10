angular.module('starter.controllers', ['ngStorage', 'ngCookies', 'ngCordova', 'starter.utils'])

.controller('SignInCtrl', function($scope, $state, $http, $sessionStorage, $cookies, ApiEndpoint, PushWoosh, $localstorage, $location, DLog) {

    function connectToOurServer(authToken, devToken) {
            DLog.log("calling our server with authToken = " + authToken + " devToken = " + devToken);
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
                    DLog.log("i last voted for: "+$sessionStorage.my_vote_id);

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
                DLog.log('call to our server fails. stat=' + status);
                $state.go('signin');
            });
    }

    DLog.log("localstorage token = " + $localstorage.get('fb_token'));
    DLog.log("localstorage uid = " + $localstorage.get('uid'));
    var now = new Date();
    token_valid = false;
    if ($localstorage.get('fb_expire')) {
        expDate = new Date($localstorage.get('fb_expire'));
        DLog.log("now is: " + now.toString() + " ; fb expire: " + expDate.toString());
        if (now < expDate) {
            DLog.log("token valid");
            token_valid = true;
        }
        else {
            DLog.log("token expired");
        }
    }

    if (token_valid && $localstorage.get('fb_token') != null && ($localstorage.get('uid') != null)) {
        $sessionStorage.uid = $localstorage.get('uid');
        DLog.log('Auto login');

        if (window.cordova) {
            if ($localstorage.get('push_token')) {
                devToken = "&device_token=" + $localstorage.get('push_token');
                connectToOurServer('token='+$localstorage.get('fb_token'), devToken);
            }
        }
        else {
            connectToOurServer('token='+$localstorage.get('fb_token'), "");
        }
        // $state.go('tabs.result-me');
    }

    var fbLoginSuccess = function(response) {
        DLog.log('fbLoginSuccess');

        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            $state.go('tabs.home');
        }
        var expDate = new Date();
        expDate.setSeconds(expDate.getSeconds() + response.authResponse.expiresIn);

        var authData = {
            id: String(response.authResponse.userID),
            access_token: response.authResponse.accessToken,
            expiration_date: expDate
        }
        DLog.log(response);

        DLog.log('Got Token: ' + response.authResponse.accessToken);
        DLog.log('Expires in: ' + response.authResponse.expiresIn + " or: " + expDate.toString());
        DLog.log("Api Endpoint = " + ApiEndpoint);
        $localstorage.set('fb_token', response.authResponse.accessToken)
        $localstorage.set('fb_expire', expDate)

        var devToken = "";

      try {
        PushWoosh.registerDevice()
        .then(function(result) {

            DLog.log("Pushwoosh result2: ", result);

            if (window.ionic.Platform.isIOS()) {
                devToken = "&device_token=" + result['deviceToken'];
                $localstorage.set('push_token', result['deviceToken'])
                console.warn('iOS push device token: ' + result['deviceToken']);
            }
            else if (window.ionic.Platform.isAndroid()) {
                devToken = "&device_token=" + result;
                $localstorage.set('push_token', result)
                console.warn('Android push token: ' + result);
            }
            else {
              console.warn('[ngPushWoosh] Unsupported platform');
            }

            connectToOurServer('token='+response.authResponse.accessToken, devToken);

        }, function(reason) {
            DLog.log('PushWoosh.registerDevice fails. reason=' + reason);
            connectToOurServer('token='+response.authResponse.accessToken, "");
        });        
      }
      catch(err) {
        console.error(err.message);
        connectToOurServer('token='+response.authResponse.accessToken, "");
      }

    };

    var fbLoginError = function(error){
        DLog.log("fbLoginError: " + error);
    };

    $scope.newLogin = function() {
        DLog.log('newLogin');
        if (!window.cordova) {
            facebookConnectPlugin.browserInit('1557020157879112');
        }
        facebookConnectPlugin.login(['public_profile, user_friends, email'], fbLoginSuccess, fbLoginError);
    };

  $scope.signIn = function() {
    DLog.log('Sign-In');
    $state.go('tabs.home');
  };

})

.controller('ResultsMeCtrl', ['$scope', '$state', 'Parties', '$sessionStorage', 'DLog', function($scope, $state, Parties, $sessionStorage, DLog) {
    $scope.indexCtrl= 16;
    
    $scope.showMore = function() {
      $scope.indexCtrl = 25;
      DLog.log(" $scope.ctrIndex ",  $scope.ctrIndex = 25);
   };

    $scope.parties = Parties.query();
    $scope.user_id = $sessionStorage.uid;
    $scope.my_vote_id = $sessionStorage.my_vote_id;
    $scope.my_vote_party = $sessionStorage.my_vote_party;
    $scope.$on('vote:updated', function(event,data) {
        DLog.log("vote:updated: " + JSON.stringify(data));
        $sessionStorage.my_vote_id = data.id;
        $scope.my_vote_id = data.id;
        $scope.my_vote_party = $sessionStorage.my_vote_party;
        DLog.log("vote updated after apply: " + $scope.my_vote_id);
        $state.go('tabs.result-friends');
    });
}])

.controller('ResultsFriendsCtrl', function($scope, Results, Parties, $sessionStorage) {
  
  $scope.renderImgSrc = function (result) {
    console.log('renderImgSrc',result.party_id);
    if(!result.isSelected)
      return 'img/parties/' + result.party_id + '-1.png';
    else
      return 'img/parties/' + result.party_id + '-2.png';
  };

  $scope.parties = Parties.query(function(){

      $scope.is_native = false;
      if (window.cordova) {
        $scope.is_native = true;
      }

    $scope.results = Results.query(function(){
      var total_number_of_votes = 0;
      $scope.totalSelected = 0;
      angular.forEach($scope.results, function(value, key) {
           value.isSelected = false;
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
      $sessionStorage.total_number_of_votes = total_number_of_votes;
    });
  });

   $scope.toggleParty = function (result) {
     result.isSelected = !result.isSelected

     $scope.sumOfVotes = 0;

     angular.forEach($scope.results, function(value) {   
       if(value.isSelected) {
         var seats = value.number_of_votes / $scope.results.total_number_of_votes * 120;
         $scope.sumOfVotes += seats;
        }
     });
     console.log("sumOfVotes", $scope.sumOfVotes);
     $scope.selectedPercents = $scope.sumOfVotes* 100 / 120;
   
  };


  var sumSelections = function() {

  };
})

.controller('ConfirmVoteCtrl', function($scope, $rootScope, $ionicModal, $http, $sessionStorage, Parties, ApiEndpoint, DLog) {
  $ionicModal.fromTemplateUrl('templates/confirm-vote-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(pid) {
    DLog.log("pid = " + pid);
    $scope.parties = Parties.query();
    $scope.pid = pid;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.confirmVote = function() {
        DLog.log("confirm vote party = " + $scope.parties[$scope.pid].id);
        DLog.log("confirm vote my_vote_id = " + $sessionStorage.my_vote_id);
        if ($sessionStorage.my_vote_id > 0) {
            meth = 'PUT';
            url = ApiEndpoint + '/votes/'+$sessionStorage.my_vote_id+'.json'
        }
        else {
            meth = 'POST';
            url = ApiEndpoint + '/votes.json';
        }
        DLog.log("user id = " + $sessionStorage.uid);
        DLog.log("party id = "+ $scope.parties[$scope.pid].id);
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
            DLog.log('vote fails');
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

.controller('FeedPartyCtrl', function($scope, FeedParty) {
  $scope.feedData = FeedParty.query();
})

.controller('FeedFlatCtrl', function($scope, FeedFlat) {
  $scope.feedData = FeedFlat.query();
})

.controller('FeedUserCtrl', function($scope, $sessionStorage, Parties, FeedUser) {
  $scope.feedData = FeedUser.query();
})

  .controller('FeedPostCtrl', function ($scope, $state, $http, $sessionStorage, DLog, Parties) {
    //console.log(parties);

    var getPartyInfo = function (partyId) {
      return $scope.parties.filter(function (p) {
        return p.id == partyId;
      })[0];
    };


    $scope.myParty = {};
    $scope.parties = Parties.query(function () {
      $scope.myParty = getPartyInfo($sessionStorage.my_vote_id);
    });

    $scope.colorOptions = ['#003663', '#790000', '#662d91', '#362f2d', '#ec008c', '#0072bc', '#f26522', '#353535'];
    $scope.chosenColor = $scope.colorOptions[0];
    $scope.chooseColor = function (color) {
      $scope.chosenColor = color;
    };

    $scope.tags = [];
    $scope.addPartyTag = function (currentTag) {
      var party = getPartyInfo(currentTag);
      party.tagged = true;
      $scope.tags.push(getPartyInfo(currentTag));
      $scope.currentTag = '';
    };
    $scope.removePartyTag = function (party) {
      party.tagged = undefined;
      $scope.tags = $scope.tags.filter(function (p) {
        return p.id !== party.id;
      });
      //$scope.tags.push(getPartyInfo(currentTag));
    };

    $scope.postToFeed = function () {
      DLog.log('Post to Feed of ' + $sessionStorage.uid + ', text: ' + $scope.text);

      if (!angular.isUndefined($scope.text) && ($scope.text !== '')) {

        var post_data = {
          "text": $scope.text,
          "color": $scope.chosenColor,
          "tags": $scope.tags.map(function (party) {
            return "party:" + party.id;
          })
        };

        meth = 'POST';
        url = '/api/stream/post/' + $sessionStorage.uid + '.json';

        $http({
          method: meth,
          url: url,
          headers: {
            'Content-Type': "application/json"
          },
          data: post_data
        })
          .success(function (data, status, headers, config) {
            DLog.log("post success: " + data);
            $state.go('tabs.feed-friends');
          })
          .error(function (data, status, headers, config) {
            DLog.log('post failed!');
          })
      }
    }

  })

.controller('IntegrityCtrl', function($scope, $state, $http, $sessionStorage, $cookies, $localstorage, DLog) {
    if ($localstorage.get('fb_token', null) == null || ($sessionStorage.uid == null)) {
        DLog.log('Bad integrity. Logging out.');
        $state.go('signin');
    }
})

.controller('ShareCtrl', function($scope, $state, $http, $sessionStorage, DLog, $cordovaSocialSharing, $ionicPlatform) {

    $scope.url = "https%3A%2F%2Fivote.org.il%2Fresults%2F" + $sessionStorage.uid;
    $scope.turl = "https//ivote.org.il/results/" + $sessionStorage.uid;

    message = "עד עכשיו הצביעו " + $sessionStorage.total_number_of_votes + " חברים." + "\n";
    message = message + "https://ivote.org.il\n";

    image = null;
    link = null;

    $scope.shareViaTwitter = function() {
        $ionicPlatform.ready(function() {
            console.log("twitter: " + message);
            $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
                $cordovaSocialSharing.shareViaTwitter(message, image, link);
            }, function(error) {
                alert("Cannot share on Twitter");
            });
        });
    }

    $scope.shareViaFacebook = function() {
        $ionicPlatform.ready(function() {
            console.log("facebook: " + message);
            $cordovaSocialSharing.canShareVia("facebook", message, image, link).then(function(result) {
                $cordovaSocialSharing.shareViaFacebook(message, image, link);
            }, function(error) {
                alert("Cannot share on Facebook");
            });
        });
    }

    $scope.shareViaWhatsApp = function() {
        $ionicPlatform.ready(function() {
            console.log("whatsapp: " + message);
            $cordovaSocialSharing.canShareVia("whatsapp", message, image, link).then(function(result) {
                $cordovaSocialSharing.shareViaWhatsApp(message, image, link);
            }, function(error) {
                alert("Cannot share on WhatsApp");
            });
        });
    }

    $scope.shareViaEmail = function() {
        $ionicPlatform.ready(function() {
            console.log("email: " + message);
            $cordovaSocialSharing.canShareVia("email", message, image, link).then(function(result) {
                $cordovaSocialSharing.shareViaEmail(message, "message from an iVote user", [], [], null);
            }, function(error) {
                alert("Cannot share on E-Mail");
            });
        });
    }

})
