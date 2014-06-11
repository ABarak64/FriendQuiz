angular.module('friendquiz')

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, $ionicLoading, FriendQuizService, $rootScope) {
        
        $scope.answered = null;
        $scope.question = null;
        $scope.questionImg = 'img/mystery.jpg';
        $scope.error = null;

        // If getting a question causes an OAuth exception, hide the 'loading' screen if it is up.
        $rootScope.$on('OAuthException', function () {
            $scope.hide();
        });

        $scope.show = function(msg) {
            $scope.loading = $ionicLoading.show({
                content: msg
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
            $scope.show('Sending answer...');
            FriendQuizService.guessAnswer(friend.id)
               .success(function (result) {
                   $scope.questionImg = 'https://graph.facebook.com/' + result.correctId + '/picture';
                   $scope.question.mysteryStatus.from = {
                       name: $scope.question.friends.filter(function (i) { return i.id === result.correctId + ''; })[0].name
                   };
                   $scope.answered = result; 
                   $scope.hide();
               }).error(function (err) {
                   $scope.hide();
               });

        }

        function loadQuestion() {
            $scope.show('Getting a question...');

            FriendQuizService.getQuestion()
                .then(function(question) {
                    $scope.hide();
                    $scope.question = question;
                }).catch(function (err) {
                    $scope.hide();
                    $scope.error = err;
            });
        }

        loadQuestion();

    });