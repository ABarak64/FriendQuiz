angular.module('friendquiz')

    .controller('LoginCtrl', function ($scope, $location, OpenFB) {

        $scope.facebookLogin = function () {

            OpenFB.login('email,read_stream,publish_stream').then(
                function () {
                    $location.path('/app/person/me/feed');
                },
                function (error) {
                    alert('Open FB login failed: ' + error.error);
                });
        };

    });