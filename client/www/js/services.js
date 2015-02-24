angular.module('starter.services', ['ngResource'])

.factory('Parties', function ($resource) {
    return $resource('/api/parties.json');
})

.factory('Results', function ($resource) {
    return $resource('/api/votes/results/1.json');
})
