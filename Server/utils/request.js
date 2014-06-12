var http = require("http");
var https = require("https");
var Q = require("q");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function (url, onResult, onError) {

    var req = https.request(url, function (res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(output);
           // var obj = output;
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function (err) {
        onError(err);
    });

    req.end();
};

exports.getJSONAsync = function (url) {

    var deferred = Q.defer();
    var badRequest = false;

    var req = https.request(url, function (res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(output);
            if (badRequest) {
                deferred.reject(obj);
            } else {
                deferred.resolve(obj);
            }
        });
    });

    req.on('error', function (err) {
        deferred.reject(err);
    });

    req.on('response', function (response) {
        if (response.statusCode === 500 || response.statusCode === 400)
            badRequest = true;
    });

    req.end();
    return deferred.promise;
};