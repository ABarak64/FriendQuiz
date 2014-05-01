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
            //OpenFB.get('/' + $stateParams.personId + '/home', { limit: 30 })
                .success(function (result) {
                    $scope.hide();

                    console.log('friendquizservice working');
                    // filter the news feed to leave only items shared by friends.
                    var filteredList = [];
                    angular.forEach(result.data, function (post) {
                        if (typeof post.from.category === 'undefined') {
                            console.log(post);
                            if (typeof post.message !== 'undefined') {
                                post.message = post.message.replace(post.from.name, 'Mystery Person');
                            }
                            if (typeof post.story !== 'undefined') {
                                post.story = post.story.replace(post.from.name, 'Mystery Person');
                            }
                            filteredList.push(post);
                        }
                    })

                    $scope.items = filteredList;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $scope.hide();
                    alert(data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });