'use strict';

var Q = require('q');
var FriendQuizData = require('./friendquizdata');

function FriendQuiz(facebookInfo) {
    var quizData = new FriendQuizData(facebookInfo);
    var numberOfBadAttempts;
    var maxBadAttempts = 3;

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
        delete post.from;
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

    function getQuestion() {
        var deferred = Q.defer();

        numberOfBadAttempts = 0;
        var set;
        makeQuestion()
            .then(function (questionAnswerSet) {
                set = questionAnswerSet;
                return quizData.saveAnswer(set.answer);
            }).then(function () {
                deferred.resolve(set.question);
            }).fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function makeQuestion (deferred) {
        if (!deferred) {
            deferred = Q.defer();
         }
        var friendSet, question, correctAnswer;

        quizData.getFriends()
            .then(function (friends) {
                friendSet = getSomeRandomFriends(friends);
                var answerFriend = friendSet[Math.ceil(Math.random() * friendSet.length) - 1];
                correctAnswer = answerFriend.id;
                return quizData.getFriendStatuses(answerFriend);
            }).then(function (status) {
                if (resultsAreBad(status.data)) {
                    numberOfBadAttempts++;
                    if (numberOfBadAttempts > maxBadAttempts) {
                        deferred.reject({ error: { message: 'Could not get a question.' }});
                    } else {
                        makeQuestion(deferred);
                    }
                } else {
                    question = {
                        friends: friendSet,
                        mysteryStatus: getAndFilterASingleStatusUpdate(status.data)
                    };
                    deferred.resolve({ 
                        question: question,
                        answer: correctAnswer
                    });
                }
            }).fail(function (error) {
                deferred.reject(error);
            });

        deferred.notify();
        return deferred.promise;
    };

    function guessAnswer(answerUserId) {
        var result = {};
        var deferred = Q.defer();

        quizData.getUser()
            .then(function(user) {
                if (typeof user.answer === 'undefined' || user.answer === 0) {
                    deferred.reject({ error: { message: 'User has no set question.' } });
                } else {
                    result.correctId = user.answer;
                    if (user.answer === answerUserId) {
                        result.correct = true;
                        user.correctStreak++;
                        if (user.correctStreak > user.highScore) {
                            user.highScore = user.correctStreak;
                        }
                    } else {
                        result.correct = false;
                        user.correctStreak = 0;
                    }
                    user.answer = 0;
                    result.correctStreak = user.correctStreak;

                    return quizData.updateUser(user);
                }
            }).then(function() {
                deferred.resolve(result);
            }).fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    function getFriendHighScores() {
        var deferred = Q.defer();

        quizData.getFriends()
            .then(function (friends) {
                return quizData.getFriendHighScores(friends);
            }).then(function (result) {
                deferred.resolve(result);
            }).fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    return {
        getQuestion: getQuestion,
        guessAnswer: guessAnswer,
        getFriendHighScores: getFriendHighScores
    }
};

module.exports = FriendQuiz;