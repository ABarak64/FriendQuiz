angular.module('friendquiz')
    .factory('FriendQuizService', function($http, $q, OpenFB) {
    
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
                    if (question.error) {
                        deferred.reject(question);
                    } else {
                        deferred.resolve(question);
                    }
                }).error(function(error) {
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

        return {
            getQuestion: getQuestion,
            guessAnswer: guessAnswer
        };
    });
