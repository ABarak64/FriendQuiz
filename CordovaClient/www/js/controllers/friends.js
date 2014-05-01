angular.module('friendquiz')

    .controller('FriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/friends', {limit: 50})
            .success(function (result) {
                console.log(result.data);
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    });