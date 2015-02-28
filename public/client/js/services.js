angular.module('starter.services', ['ngResource'])

.factory('Parties', function ($resource) {
    return $resource('/api/parties.json');
})

.factory('GetUserID', function ($resource, $sessionStorage) {
    return $resource('/api/connect/user/' + $sessionStorage.fbuid + '.json');
})

.factory('UserVote', function ($resource, $sessionStorage) {
    return $resource('/api/votes/' + $sessionStorage.uid + '.json');
})

.factory('Results', function ($resource) {
    return $resource('/api/votes/results/1.json');
})

.factory('FeedFlat', function ($resource, $sessionStorage) {
    return $resource('/api/stream/flat/' + $sessionStorage.uid + '.json');
})

.factory('FeedUser', function ($resource, $sessionStorage) {
    return $resource('/api/stream/user/' + $sessionStorage.uid + '.json');
})
