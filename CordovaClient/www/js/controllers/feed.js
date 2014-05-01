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

            console.log('inside getquestion');
            FriendQuizService.getQuestion()
                .then(function (result) {
                    $scope.hide();

                    // filter the news feed to leave only items shared by friends.
                    var filteredList = [];
                    angular.forEach(result.data, function (post) {
                        console.log(post);
                        if (typeof post.message !== 'undefined') {
                            post.message = post.message.replace(post.from.name, 'Mystery Person');
                        } else if (typeof post.place !== 'undefined') {
                            post.message = 'Mystery Person just visited ' + post.place.name;
                        }
                        if (typeof post.story !== 'undefined') {
                            post.story = post.story.replace(post.from.name, 'Mystery Person');
                        }
                        filteredList.push(post);
                    })

                    $scope.items = filteredList;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });