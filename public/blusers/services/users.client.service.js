/**
 * Created by GB115151 on 29/04/2016.
 */
angular.module('users').factory('Users', ['$resource',
    function($resource) {
        return $resource('api/users/:userId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }]);