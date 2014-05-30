angular.module('friendquiz')
    .factory('FriendQuizService', function($http, $q, OpenFB) {

        function getQuestion() {
            var header = {
                headers: {
                    'userid': OpenFB.getFbId(),
                    'token': OpenFB.getFbToken()
                }
            };
            return $http.get('http://friendquiz-yup.rhcloud.com/question/', header);
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
