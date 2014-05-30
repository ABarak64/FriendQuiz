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
            $scope.show();
            FriendQuizService.guessAnswer(friend.id)
               .success(function (result) {
                   $scope.questionImg = 'https://graph.facebook.com/' + result.correctId + '/picture';
                   $scope.question.mysteryStatus.from = {
                       name: $scope.question.friends.filter(function (i) { return i.id === result.correctId + ''; })[0].name
                   };
                   $scope.answered = {
                       message: result.correct ? 'You were correct!' : 'Sorry, you were wrong.'
                   };
                   $scope.hide();
               }).error(function (err) {
                   $scope.hide();
               });

        }

        function loadQuestion() {
            $scope.show();

            FriendQuizService.getQuestion()
                .success(function(question) {
                    $scope.hide();
                    $scope.question = question;
                    console.log('got question');
                    console.log($scope.question);
                }).error(function (err) {
                    $scope.hide();
                    console.log('question error');
                    console.log(err);
            });
        }

        loadQuestion();

    });