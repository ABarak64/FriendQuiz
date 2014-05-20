angular.module('friendquiz')

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, $ionicLoading, FriendQuizService, $rootScope) {
        
        $scope.answered = null;
        $scope.question = null;
        $scope.questionImg = 'img/mystery.jpg';

        // If getting a question causes an OAuth exception, hide the 'loading' screen if it is up.
        $rootScope.$on('OAuthException', function () {
            $scope.hide();
        });

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Getting a question...'
            });
        };

        $scope.hide = function(){
            $scope.loading.hide();
        };

        $scope.nextQuestion = function () {
            $scope.answered = null;
            $scope.question = null;
            $scope.questionImg = 'img/mystery.jpg';
            loadQuestion();
        }

        $scope.selectFriend = function (friend) {
            $scope.questionImg = 'https://graph.facebook.com/' + $scope.question.mysteryStatus.from.id + '/picture';
            var answered = {
                message: 'Sorry, you were wrong.'
            };
            if (friend.id === $scope.question.mysteryStatus.from.id) {
                answered.message = 'You were correct!';
            }
            $scope.answered = answered;
        }

        function loadQuestion() {
            $scope.show();

            FriendQuizService.getQuestion()
                .success(function (question) {
                    $scope.hide();
                    $scope.question = question;
                });
        }

        loadQuestion();

    });