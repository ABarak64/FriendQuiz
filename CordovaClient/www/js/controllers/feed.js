angular.module('friendquiz')

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, $ionicLoading, FriendQuizService) {

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };

        function loadFeed() {
            $scope.show();

            FriendQuizService.getQuestion()
                .then(function (question) {
                    $scope.hide();

                    console.log('my question');
                    console.log(question);
                    $scope.question = question;
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });