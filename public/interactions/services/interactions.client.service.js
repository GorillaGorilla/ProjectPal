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
            }
        });
    }]);