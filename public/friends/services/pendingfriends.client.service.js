/**
 * Created by GB115151 on 24/05/2016.
 */
angular.module('friends').factory('PendingFriends', ['$resource',
    function($resource) {
        return $resource('api/pendingfriends/:friendId', {
            friendId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }]);