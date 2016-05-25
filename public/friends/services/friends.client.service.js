/**
 * Created by GB115151 on 24/05/2016.
 */
angular.module('friends').factory('Friends', ['$resource',
    function($resource) {
        return $resource('api/friends/:friendId', {
            friendId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }]);