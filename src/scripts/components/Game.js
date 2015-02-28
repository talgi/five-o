
'use strict';

var React = require('react');
var FirebaseRefs = require('../services/FirebaseRefs');
var ReactFireMixin = require('reactfire');
var Hand = require('./Hand');
var Card = require('./Card');

require('../../styles/game.css');


var Game = React.createClass({
  mixins: [ReactFireMixin],
  initNewGame: function (gameId, deckId) {
    this.bindAsObject(FirebaseRefs.gameRef(gameId), "game");
    FirebaseRefs.deckRef(deckId).once('value', function (snapshot) {
      this.setState({ deck: snapshot.val() });
    }, this);
  },
  componentDidUpdate: function () {
    if (this.state.game && this.state.deck && Object.keys(this.state.game.players).length === 2) {
      var turn = this.state.game.turn || 0;
      if ((turn < 10) && (this.myPlayerId() === 0)) {
        for (var i=turn; i<10; i++) {
          this.firebaseRefs.game.child('players/' + i % 2 + '/hands/'+ parseInt(i/2)).push(this.state.deck.cards[i]);
        }
        this.firebaseRefs.game.child('turn').set(10);
      }
    }
  },
  componentWillMount: function () {
    this.initNewGame(this.props.gameId, this.props.deckId);
  },
  componentWillReceiveProps: function (newProps) {
    if (newProps.gameId !== this.props.gameId) {
      this.unbind("game");
      this.setState({ deck: undefined });
      this.initNewGame(newProps.gameId, newProps.deckId);
    }
  },
  getInitialState: function() {
    return {};
  },
  myPlayerId: function () {
    if (this.props.userID === this.state.game.players[0].id) { return 0; }
    else if (this.props.userID === this.state.game.players[1].id) { return 1; }
    else { return -1; }
  },
  playerTurn: function () {
    return (this.state.game.turn) % 2;
  },
  isMyTurn: function () {
    return (this.state.game.turn > 9) && (this.props.userID === this.state.game.players[this.playerTurn()].id);
  },

  onHandSelected: function (handNumber) {
    if (this.isMyTurn()) {
      this.firebaseRefs.game.child('players/' + this.playerTurn() + '/hands/'+ handNumber).push(this.state.deck.cards[this.state.game.turn]);
      this.firebaseRefs.game.child('turn').set(this.state.game.turn+1);
    }
  },
  getPlayerHand: function (player, handNumber) {
    var hand = this.state.game.players[player].hands ? this.state.game.players[player].hands[handNumber] : [];
    return hand || [];
  },
  isHandClickable: function (player, handNumber) {
    if (!this.isGameOver() && this.playerTurn() === player && this.isMyTurn()) {
      return (Object.keys(this.getPlayerHand(player, handNumber)).length<(1+parseInt(this.state.game.turn/10)));
    }
  },
  isGameOver: function () {
    return (this.state.game.turn >= 50);
  },
  render: function() {
      if (this.state.game && this.state.deck && this.state.game.turn !== undefined) {

        var hands = [[],[]];
        for (var i=0;i<5;i++) {
          for (var j=0;j<2;j++) {
            hands[j][i] = <div className='playerHand'><Hand handNumber={i} myHand={(this.myPlayerId()===j)?1:0} clickable={this.isHandClickable(j,i)} onHandSelected={this.onHandSelected} hand={this.getPlayerHand(j,i)} gameOver={this.isGameOver()}/></div>;
          }
        }

        var turnText = this.isGameOver() ? <div>Game Over!</div> : <div>{this.isMyTurn() ? 'Its your turn!' : (this.state.game.players[this.playerTurn()].name + '\'s turn!')}</div>;
        var deck = this.isGameOver() ? '' : <div className='deck'><Card number={this.state.deck.cards[this.state.game.turn]} hidden={!this.isMyTurn()}/></div>;
        return (
          <div className='game'>
            <div className='playerHands upside'>{hands[0]}</div>
            {turnText}
            {deck}
            <div className='playerHands'>{hands[1]}</div>
          </div>
        ) ;
      } else {
        return (<div></div>);
      }


  }
});

module.exports = Game;
