/**
 * Created by GB115151 on 25/05/2016.
 */
angular.module('interactions').factory('Interactions', ['$resource',
    function($resource) {
        return $resource('api/interactions/:friendId', {
            friendId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            viewFriend: {
                method: 'GET',
                url: 'api/interactions/:friendId/show/:friend2Id',
                params: {friendId: '@_id',
                    friend2Id: '@_id'},
                isArray: true
            },
            seeScores: {
                method: 'GET',
                url: 'api/interactions/score/:friendId/show/:friend2Id',
                params: {friendId: '@_id',
                    friend2Id: '@_id'},
                isArray: false
            },
        });
    }]);