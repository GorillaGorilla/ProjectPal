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

        $scope.create = function(){
            var interaction = new Interactions({
                description: this.description,
                level: this.level,
                instigator: this.instigator._id,
                target: $scope.authentication.user._id
            });
            interaction.$save(function(response) {
                $location.path('/interactions');
            }, function(errorResponse) {
                console.log("err: " + errorResponse)
                $scope.error = errorResponse.data.message;
            });
        }

        $scope.list = function(){
            $scope.logs = Interactions.query();
        }

        $scope.levelRange = [-5,-3,-1,0,1,3,5];


    }
]);