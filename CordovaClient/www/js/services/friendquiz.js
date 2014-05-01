angular.module('friendquiz')

    .factory('FriendQuizService', function ($http, OpenFB) {

        return {
            getQuestion: function () {
                return OpenFB.get('/me/home', { limit: 30 })
            }               
        };
    });
