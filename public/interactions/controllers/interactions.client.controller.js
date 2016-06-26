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
            console.log("friends: " + JSON.stringify($scope.friends));
        };

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
            $scope.logs = Interactions.query({
                friendId: $routeParams.friendId
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
            $scope.logs = Interactions.viewFriend(reqObj);
        };

        $scope.findOne = function(){
            $scope.friend = Friends.get({
                friendId: $routeParams.friendId
            });
        };

        $scope.getScore = function(){


            var reqObj = {};
            if($routeParams.friendId){
                reqObj = {friendId: $routeParams.friendId};;
            }

            if($routeParams.friend2Id){
                reqObj = {friendId: $routeParams.friendId,
                    friend2Id: $routeParams.friend2Id};
            }

            $scope.stats = Interactions.seeScores(reqObj, function(res){
                console.log("res: " + JSON.stringify(res));
                $scope.stats = res;
            });
        };

        $scope.levelRange = [-5,-3,-1,1,3,5];

        $scope.openFriendLink = function(log){
            console.log('openFriendLink clicked');
            $location.path('/interactions/' + log.instigator.id + '/show/' + log.target.id );
        };

    }
]);