angular.module('starter.services', ['ngResource'])

.factory('Parties', function ($resource) {
    return $resource('/api/parties.json');
})

.factory('LOCALParties', function($resource) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var parties = [{
    id: 0,
    name: 'המחנה הציוני',
    ident: 'אמת'
  }, {
    id: 1,
    name: 'הליכוד',
    ident: 'מחל'
  }, {
    id: 2,
    name: 'מרצ',
    ident: 'מרצ'
  }, {
    id: 3,
    name: 'הבית היהודי',
    ident: 'טב'
  }, {
    id: 4,
    name: 'יש עתיד',
    ident: 'פה'
  }, {
    id: 5,
    name: 'הרשימה המשותפת',
    ident: 'ודעם'
  }
  ];

  return {
    query: function() {
        return parties;
    },
    remove: function(p) {
      parties.splice(parties.indexOf(p), 1);
    },
    get: function(pId) {
      for (var i = 0; i < parties.length; i++) {
        if (parties[i].id === parseInt(pId)) {
          return parties[i];
        }
      }
      return null;
    }
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})


.factory('LocalResults', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var results = [{
    id: 0,
    name: 'המחנה הציוני',
    result: 5,
    friends: 3
  }, {
    id: 1,
    name: 'הליכוד',
    result: 15,
    friends: 3
  }, {
    id: 2,
    name: 'מרצ',
    result: 50,
    friends: 3
  }, {
    id: 3,
    name: 'הבית היהודי',
    result: 35,
    friends: 3
  }, {
    id: 4,
    name: 'יש עתיד',
    result: 0,
    friends: 3
  }, {
    id: 5,
    name: 'הרשימה המשותפת',
    result: 75,
    friends: 3
  }
  ];


  return {
    all: function() {
      return results;
    },
    get: function(resultsId) {
      // Simple index lookup
      return results[resultsId];
    }
  }
  })

.factory('Results', function ($resource) {
    return $resource('/api/votes/results/1.json');
})
