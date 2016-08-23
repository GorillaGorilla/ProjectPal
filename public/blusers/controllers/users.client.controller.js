/**
 * Created by GB115151 on 29/04/2016.
 */
angular.module('users').controller('UsersController', ['$scope',
    '$routeParams', '$location', 'Authentication', 'Users',
    function($scope, $routeParams, $location, Authentication, Users)
    {
        $scope.authentication = Authentication;
        $scope.find = function() {
            $scope.users = Users.query();
        };
        $scope.findOne = function() {
            $scope.user = Users.get({
                userId: $routeParams.userId
            }, function(){
                console.log("scope.user: " + $scope.user);
            });
        };
        $scope.update = function() {
            $scope.user.$update(function() {
                $location.path('/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);