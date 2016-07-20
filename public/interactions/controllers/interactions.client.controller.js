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
            var fId = $routeParams.friendId || $scope.authentication.user.id;
            $scope.logs = Interactions.query({
                friendId: fId
            },function(response) {
                $scope.stuff = $scope.logs.reduce(function(a, b){
                    console.log("a: " + a);
                    return (a.level + b.level);
                }, 0);

                console.log("stuff: " + $scope.stuff);

            }, function(errorResponse) {
                console.log("err: " + errorResponse)
                $scope.error = errorResponse.data.message;
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
                $scope.stats = res;
            });
        };

        $scope.levelRange = [-5,-3,-1,1,3,5];

        $scope.openFriendLink = function(log){
            console.log('openFriendLink clicked');
            $location.path('/interactions/' + log.instigator.id + '/show/' + log.target.id );
        };


        //chart stuff
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };

    }
]);