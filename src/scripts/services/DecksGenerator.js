'use strict';

var FirebaseRefs = require('./FirebaseRefs');

var DecksGenerator = {};


function randomDeck() {
  var deck = [];
  for (var i = 0; i < 52; i++ ) {
    deck.push(i);
  }
  var unorderedDeck = [];
  while (deck.length) {
    var x = parseInt(Math.random()*deck.length);
    var n = deck[x];
    unorderedDeck.push(n);
    deck.splice(x, 1);
  }
  return unorderedDeck;
}

DecksGenerator.generateDeck = function () {
  var gameRef = FirebaseRefs.decks.push({ cards:randomDeck() });
};

module.exports = DecksGenerator;
