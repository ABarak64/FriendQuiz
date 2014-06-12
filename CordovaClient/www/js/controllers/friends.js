angular.module('friendquiz')

    .controller('FriendsCtrl', function ($scope, $stateParams, FriendQuizService, $ionicLoading) {
        // If getting friend scores causes an OAuth exception, hide the 'loading' screen if it is up.
        $rootScope.$on('OAuthException', function () {
            $scope.hide();
        });

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