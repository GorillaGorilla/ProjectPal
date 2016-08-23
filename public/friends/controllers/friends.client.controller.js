/**
 * Created by GB115151 on 24/05/2016.
 */
angular.module('friends').controller('FriendsController', ['$scope',
    '$routeParams', '$location', 'Authentication', 'Friends', 'PendingFriends',
    function($scope, $routeParams, $location, Authentication, Friends, Pendingfriends)
    {
        $scope.authentication = Authentication;
        $scope.list = function(){
            var obj = [];
            //obj = Friends.query();
            //console.log("obj: " + JSON.stringify(obj));
            //console.log("obj.friends " + obj.friends);
            //$scope.friends = obj.friends;
            //$scope.pendingFriends = obj.pendingFriends;

            $scope.friends = Friends.query();
            $scope.pendingFriends = Pendingfriends.query();
        };

        $scope.listpending = function(){
            $scope.pendingFriends = Pendingfriends.query();
        };

        $scope.findOne = function(){
            $scope.friend = Friends.get({
                friendId: $routeParams.friendId
            });
        };

        $scope.accept = function(pendingFriend){
            pendingFriend.$update(function(response) {
                console.log(response);
                $location.path('/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };



        $scope.add = function(user, friend){
            console.log("add called");
            console.log(friend.username);
            var user = user || $scope.authentication.user
            if (friend.pendingFriends.indexOf(user._id) === -1){
                friend.pendingFriends.push(user._id);
                friend.$update(function() {
                    // console.log("afterUpdate " + JSON.stringify(friend));  //no longer has anything in friend array...
                    $location.path('/');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };


        };


    }]

);