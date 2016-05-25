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
            });
        };
        $scope.update = function() {
            $scope.user.$update(function() {
                $location.path('/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.add = function(){
            var obj = {userID : $scope.authentication.user._id};
            $scope.user.pendingFriends.push($scope.authentication.user._id);
            console.log("friend pushed " + JSON.stringify($scope.user));  // has something in friend array
            $scope.user.$update(function() {
                console.log("afterUpdate " + JSON.stringify($scope.user));  //no longer has anything in friend array...
                $location.path('/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);