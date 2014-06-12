angular.module('friendquiz')
    .factory('FriendQuizService', function($http, $q, OpenFB, $rootScope) {
    
        function getQuestion() {
            var deferred = $q.defer();
            var header = {
                headers: {
                    'userid': OpenFB.getFbId(),
                    'token': OpenFB.getFbToken()
                }
            };
            $http.get('http://friendquiz-yup.rhcloud.com/question/', header)
                .success(function (question) {
                    deferred.resolve(question);
                }).error(function (error) {
                    if (error.error && error.error.type === 'OAuthException') {
                        $rootScope.$emit('OAuthException');
                    }
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        function guessAnswer(guess) {
            var header = {
                headers: {
                    'userid': OpenFB.getFbId(),
                    'token': OpenFB.getFbToken()
                }
            };
            return $http.post('http://friendquiz-yup.rhcloud.com/answer/', { 'answer': guess }, header);
        };

        function getHighScores() {
            var header = {
                headers: {
                    'userid': OpenFB.getFbId(),
                    'token': OpenFB.getFbToken()
                }
            };
            return $http.get('http://friendquiz-yup.rhcloud.com/highscores/', header);
        };

        return {
            getQuestion: getQuestion,
            guessAnswer: guessAnswer,
            getHighScores: getHighScores
        };
    });
