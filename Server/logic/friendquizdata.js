'use strict';

var Q = require('q');
var request = require('../utils/request');
var AWS = require('aws-sdk');
var config = require('../config');

AWS.config.update({ accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, region: 'us-west-2' });


function FriendQuizData(facebookInfo) {
    var friends = [];
    var db = new AWS.DynamoDB({ apiVersion: '2014-05-21' });

    function getFriends() {
        var deferred = Q.defer();

        if (friends.length === 0) {
            var url = 'https://graph.facebook.com/me/friends?access_token=' + facebookInfo.token;
            request.getJSONAsync(url)
                .then(function (result) {
                    friends = result.data;
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
        } else {
            deferred.resolve(friends);
        }

        return deferred.promise;
    };

    function getFriendStatuses(friend) {
        var deferred = Q.defer();

        var url = 'https://graph.facebook.com/' + friend.id + '/statuses?access_token=' + facebookInfo.token;
        request.getJSONAsync(url)
            .then(function(result) {
                deferred.resolve(result);
            }, function(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function updateUser(user) {
        var deferred = Q.defer();

        var params = {
            TableName: 'Users',
            Key: {
                Id: {
                    N: user.id + ''
                }
            },
            AttributeUpdates: {
                Answer: {
                    Action: 'PUT',
                    Value: {
                        N: user.answer + ''
                    }
                },
                CorrectStreak: {
                    Action: 'PUT',
                    Value: {
                        N: user.correctStreak + ''
                    }
                },
                HighScore: {
                    Action: 'PUT',
                    Value: {
                        N: user.highScore + ''
                    }
                }
            }
        };

        db.updateItem(params, function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve();
            }
        });

        return deferred.promise;
    }

    function getUser() {
        var deferred = Q.defer();

        var params = {
            TableName: 'Users',
            Key: {
                Id: {
                    N: facebookInfo.id + ''
                }
            },
            ConsistentRead: true
        };

        db.getItem(params, function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                var user = {
                    id: parseInt(data.Item.Id.N),
                    answer: parseInt(data.Item.Answer.N)
                }
                if (typeof data.Item.CorrectStreak === 'undefined') {
                    user.correctStreak = 0;
                    user.highScore = 0;
                } else {
                    user.correctStreak = parseInt(data.Item.CorrectStreak.N);
                    user.highScore = parseInt(data.Item.HighScore.N);
                }
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    }

    function saveAnswer(idOfMysteryStatusPoster) {
        var deferred = Q.defer();

        var params = {
            TableName: 'Users',
            Key: {
                Id: {
                    N: facebookInfo.id + ''
                }
            },
            AttributeUpdates: {
                Answer: {
                    Action: 'PUT',
                    Value: {
                        N: idOfMysteryStatusPoster + ''
                    }
                }
            }
        };

        db.updateItem(params, function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }

    return {
        getFriendStatuses: getFriendStatuses,
        getFriends: getFriends,
        saveAnswer: saveAnswer,
        getUser: getUser,
        updateUser: updateUser
    };
};

module.exports = FriendQuizData;