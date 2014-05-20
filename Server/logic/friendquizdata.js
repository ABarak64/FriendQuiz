'use strict';

var Q = require('q');
var request = require('../utils/request');

function FriendQuizData(facebookInfo) {
    var friends = [];

    function getFriends() {
        var deferred = Q.defer();

        if (friends.length === 0) {
            var url = 'https://graph.facebook.com/me/friends?access_token=' + facebookInfo.token;
            request.getJSONAsync(url)
                .then(function(result) {
                    friends = result.data;
                    deferred.resolve(result.data);
                }, function(error) {
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

    return {
        getFriendStatuses: getFriendStatuses,
        getFriends: getFriends
    };
};

module.exports = FriendQuizData;