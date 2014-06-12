angular.module('friendquiz')

    .controller('FriendsCtrl', function ($scope, $stateParams, FriendQuizService) {
        FriendQuizService.getHighScores()
            .success(function(friends) {
                console.log(friends);
                $scope.friends = friends;
        }).error(function (data) {
                alert(data.error.message);
            });
    });