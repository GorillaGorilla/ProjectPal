/**
 * Created by GB115151 on 24/05/2016.
 */
angular.module('friends').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/friends', {
            templateUrl: 'friends/views/list-friends.client.view.html'
        }).when('/friends/:friendId', {
            templateUrl: 'friends/views/view-friend.client.view.html'
        }).when('/friends/:friendId/log', {
            templateUrl: 'friends/views/log-friend.client.view.html'
        });
    }
]);