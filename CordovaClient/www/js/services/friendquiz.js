angular.module('friendquiz')

    .factory('FriendQuizService', function ($http, $q, OpenFB) {

        var friends = [];

        function getFriends() {
            var deferred = $q.defer();

            if (friends.length === 0) {
                OpenFB.get('/me/friends', { limit: 100 })
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

        function getRandomFriendStatus(friends) {
            var deferred = $q.defer();

            
            var answerFriend = friends[Math.ceil(Math.random() * friends.length) - 1];
            OpenFB.get('/' + answerFriend.id + '/statuses', { limit: 50 })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (data) {
                    alert(data.error.message);
                    deferred.reject();
                });

            return deferred.promise;
        }

        function getSomeRandomFriends() {
            var randomFriends = [];
            for (var i = 0; i < 4; i++) {
                var index = Math.ceil(Math.random() * (friends.length - 1 - i));
                randomFriends.push(friends[index]);
                var temp = friends[index];
                friends[index] = friends[friends.length - 1 - i];
                friends[friends.length - 1 - i] = temp;
            }
            return randomFriends;
        }

        function resultsAreBad(status)
        {
            if (status.data.length === 0) {
                return true;
            }
            var foundAGoodStatus = false;
            angular.forEach(status.data, function (post) {
                if (typeof post.message !== 'undefined') {
                    foundAGoodStatus = true;
                }
            });
            return !foundAGoodStatus;
        }

        function getAndFilterASingleStatusUpdate(status) {
            var randomStatusIndex = 0;

            var goodStatuses = [];
            angular.forEach(status.data, function (post) {
                if (typeof post.message !== 'undefined') {
                    goodStatuses.push(post);
                }
            })

            var post = goodStatuses[Math.ceil(Math.random() * goodStatuses.length) - 1];
            post.message = post.message.replace(post.from.name, 'Mystery Person');
            if (typeof post.story !== 'undefined') {
                post.story = post.story.replace(post.from.name, 'Mystery Person');
            }
            return post;
        }

        function getQuestion() {
            var header = {
                headers: {
                    'userid': OpenFB.getFbId(),
                    'token': OpenFB.getFbToken()
                }
            };
            return $http.get('http://friendquiz-yup.rhcloud.com/question/', header);
        };      

        return {
            getQuestion: getQuestion
        };
    });
