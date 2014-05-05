angular.module('friendquiz')

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, $ionicLoading, FriendQuizService) {
        
        $scope.answered = null;
        $scope.question = null;
        $scope.questionImg = 'img/mystery.jpg';

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
                .then(function (question) {
                    $scope.hide();

                    console.log('my question');
                    console.log(question);
                    $scope.question = question;
                });
        }

        loadQuestion();

    });