'use strict';

var Q = require('q');
var FriendQuizData = require('./friendquizdata');

function FriendQuiz(facebookInfo) {
    var quizData = new FriendQuizData(facebookInfo);

    function resultsAreBad (statuses) {
        if (statuses.length === 0) {
            return true;
        }
        var foundAGoodStatus = false;
        statuses.forEach(function (post) {
            if (typeof post.message !== 'undefined') {
                foundAGoodStatus = true;
            }
        });
        return !foundAGoodStatus;
    };

    function getAndFilterASingleStatusUpdate (statuses) {
        var goodStatuses = [];
        statuses.forEach(function (post) {
            if (typeof post.message !== 'undefined') {
                goodStatuses.push(post);
            }
        });

        var post = goodStatuses[Math.ceil(Math.random() * goodStatuses.length) - 1];
        post.message = post.message.replace(post.from.name, 'Mystery Person');
        if (typeof post.story !== 'undefined') {
            post.story = post.story.replace(post.from.name, 'Mystery Person');
        }
        return post;
    };

    function getSomeRandomFriends(friends) {
        var randomFriends = [];
        for (var i = 0; i < 4; i++) {
            var index = Math.ceil(Math.random() * (friends.length - 1 - i));
            randomFriends.push(friends[index]);
            var temp = friends[index];
            friends[index] = friends[friends.length - 1 - i];
            friends[friends.length - 1 - i] = temp;
        }
        return randomFriends;
    };

    function getQuestion (deferred) {
        if (!deferred) {
            deferred = Q.defer();
         }

        quizData.getFriends().then(function (friends) {
            var friendSet = getSomeRandomFriends(friends);
            var answerFriend = friendSet[Math.ceil(Math.random() * friendSet.length) - 1];

             return quizData.getFriendStatuses(answerFriend).then(function (status) {
                if (resultsAreBad(status.data)) {
                    getQuestion(deferred);
                } else {
                    var question = {
                        friends: friendSet,
                        mysteryStatus: getAndFilterASingleStatusUpdate(status.data)
                    };
                    deferred.resolve(question);
                }
            }).fail(function(error) {
                deferred.reject(error);
            });
        });
        deferred.notify();
        return deferred.promise;
    };

    return {
        getQuestion: getQuestion
    }
};

module.exports = FriendQuiz;