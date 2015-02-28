angular.module('starter.services', ['ngResource'])

.factory('Parties', function ($resource, ApiEndpoint) {
    return $resource(ApiEndpoint + '/parties.json');
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
