angular.module('friendquiz')

    .controller('FriendsCtrl', function ($scope, $stateParams, FriendQuizService, $ionicLoading) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting Friend High Scores...'
        });

        FriendQuizService.getHighScores()
            .success(function(friends) {
                $scope.friends = friends;
                $scope.loading.hide();
            }).error(function (data) {
                $scope.loading.hide();
                alert(data.error.message);
            });
    });