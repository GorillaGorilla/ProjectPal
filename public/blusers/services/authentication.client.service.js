/**
 * Created by Frederick on 27/03/2016.
 */
angular.module('users').factory('Authentication', [
    function() {
        this.user = window.user;
        return {
            user: this.user
        };
    }
]);