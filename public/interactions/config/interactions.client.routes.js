/**
 * Created by GB115151 on 25/05/2016.
 */
angular.module('interactions').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/interactions', {
            templateUrl: 'interactions/views/list-interactions.client.view.html'
        })
            .when('/interactions/create', {
            templateUrl: 'interactions/views/log-event.client.view.html'
        }).when('/interactions/:friendId',{
            templateUrl: 'interactions/views/friend-log.client.view.html'
        }).when('/interactions/:friendId/show/:friend2Id',{
            templateUrl: 'interactions/views/view-relationship.client.view.html'
        });

            //.when('/interactions/:articleId', {
        //    templateUrl: 'interactions/views/view-interaction.client.view.html'
        //}).when('/interactions/:articleId/edit', {
        //    templateUrl: 'interactions/views/edit-insteraction.client.view.html'
        //});
    }
]);