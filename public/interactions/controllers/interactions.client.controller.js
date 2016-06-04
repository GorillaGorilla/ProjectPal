/**
 * Created by GB115151 on 25/05/2016.
 */
angular.module('interactions').controller('InteractionsController', ['$scope',
    '$routeParams', '$location', 'Authentication', 'Friends','Interactions',
    function($scope, $routeParams, $location, Authentication, Friends, Interactions)
    {
        $scope.authentication = Authentication;
        $scope.listFriends = function(){

            $scope.friends = Friends.query();
            console.log("firends: " + JSON.stringify($scope.friends));
        };

        $scope.personalScore = 0;
        //$scope.friendScore = 0;

        $scope.create = function(friend){
            var interObj;
            if (friend){
                interObj = {
                    description: this.description,
                    level: this.level,
                    instigator: friend._id,
                    target: $scope.authentication.user._id};
            }else{
                interObj = {
                    description: this.description,
                    level: this.level,
                    instigator: this.instigator._id,
                    target: $scope.authentication.user._id};
            }

            var interaction = new Interactions(interObj);
            interaction.$save(function(response) {
                $location.path('/interactions');
            }, function(errorResponse) {
                console.log("err: " + errorResponse)
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.list = function(){
            $scope.personalScore = 0;
            if($routeParams.friendId){
                $scope.friendScore = 0;
            }

            $scope.logs = Interactions.query({
                friendId: $routeParams.friendId
            }, function(){
                $scope.logs.filter(function(log){
                    return log.instigator.id === $scope.authentication.user.id;
                }).forEach(function(log){
                    $scope.personalScore += log.level;
                });
                if ($scope.friendScore === 0){
                    $scope.logs.filter(function(log){
                        return log.target.id === $scope.authentication.user.id;
                    }).forEach(function(log){
                        $scope.friendScore += log.level;
                    });
                };
            });
        };

        $scope.friendViewer = function(){
            $scope.personalScore = 0;
            var reqObj = {friendId: $routeParams.friendId};
            if($routeParams.friend2Id){
                $scope.friendScore = 0;
                reqObj = {friendId: $routeParams.friendId,
                friend2Id: $routeParams.friend2Id};
            }
            $scope.logs = Interactions.viewFriend(reqObj, function(){
                $scope.logs.filter(function(log){
                    return log.instigator.id === $routeParams.friendId;
                }).forEach(function(log){
                    $scope.personalScore += log.level;
                });
                if ($scope.friendScore === 0){
                    $scope.logs.filter(function(log){
                        return log.target.id === $scope.authentication.user.id;
                    }).forEach(function(log){
                        $scope.friendScore += log.level;
                    });
                };
            });
        };

        $scope.findOne = function(){
            $scope.friend = Friends.get({
                friendId: $routeParams.friendId
            });
        };

        $scope.levelRange = [-5,-3,-1,0,1,3,5];


    }
]);