FriendQuiz
==========

Turns the statuses of your Facebook friends into a quiz.

CordovaClient
------------

A cross-platform mobile client application built with Ionic, Angular.js and Cordova that allows a user to answer a quiz regarding the statuses of their friends. Additionally, the user can compare their winning streaks with their other friends playing FriendQuiz.

Server
------

Where all the fun stuff happens. A Node.js web service that fetches new questions for clients, determines whether client answers are correct and persists winning streak information. Accomplished by leveraging 3rd-party web services such as the Facebook Graph API and Amazon DynamoDB.