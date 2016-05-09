/**
 * Created by GB115151 on 30/04/2016.
 */
angular.module('users').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/users', {
            templateUrl: 'blusers/views/list-users.client.view.html'
        }).when('/users/:userId', {
            templateUrl: 'blusers/views/view-user.client.view.html'
        }).when('/users/:userId/edit', {
            templateUrl: 'blusers/views/edit-user.client.view.html'
        });
    }
]);