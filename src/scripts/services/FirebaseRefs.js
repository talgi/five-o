'use strict';

var Firebase = require('firebase');

var FirebaseRefs = {};

FirebaseRefs.base = new Firebase("https://five-o.firebaseio.com");
FirebaseRefs.online = new Firebase("https://five-o.firebaseio.com/.info/connected");
FirebaseRefs.games = new Firebase("https://five-o.firebaseio.com/games");
FirebaseRefs.decks = new Firebase("https://five-o.firebaseio.com/decks");

FirebaseRefs.userRef = function (userId) {
  return new Firebase("https://five-o.firebaseio.com/users/" + userId);
};

FirebaseRefs.gameRef = function (gameId) {
  return new Firebase("https://five-o.firebaseio.com/games/" + gameId);
};

FirebaseRefs.deckRef = function (decksId) {
  return new Firebase("https://five-o.firebaseio.com/decks/" + decksId);
};


module.exports = FirebaseRefs;
