angular.module('friendquiz')

    .factory('FriendQuizService', function ($http, $q, OpenFB) {

        var friends = [];

        function getFriends() {
            var deferred = $q.defer();
            if (friends.length === 0) {
                OpenFB.get('/me/friends', { limit: 50 })
                    .success(function (result) {
                        friends = result.data;
                        deferred.resolve();
                    })
                    .error(function (data) {
                        alert(data.error.message);
                        deferred.reject();
                    });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        };

        return {
            getQuestion: function () {
                var deferred = $q.defer();
                getFriends().then(function () {
                    OpenFB.get('/6015710/statuses', { limit: 30 })
                        .success(function (result) {
                            deferred.resolve(result);
                        })
                        .error(function (data) {
                            alert(data.error.message);
                            deferred.reject();
                        });
                });
                return deferred.promise;
            }               
        };
    });
