'use strict';

var React = require('react');
var FirebaseRefs = require('../services/FirebaseRefs');
var GameDescription = require('./GameDescription');

require('../../styles/gamelist.css');

var GamesList = React.createClass({
  games: {},
  firebaseChangeHandler: function (removed) {
    return function (snapShot) {
      if (this.isMounted()) {
        var res = !removed ? this.games[snapShot.key()] = snapShot.val() : delete this.games[snapShot.key()];
        this.setState({
          games: this.games
        });
      }
    }.bind(this);
  },
  findDeck: function (gameRef) {
    var that = this;
    var deck = FirebaseRefs.decks.orderByChild('gameId').limitToFirst(1).once('value', function (decks) {
      decks.forEach(function (deck) {
        FirebaseRefs.decks.child(deck.key()).transaction(function (data) {
          if (!data) {
            return { gameId: gameRef.key() };
          } else if (!data.gameId) {
            data.gameId = gameRef.key();
            return data;
          }
        },function(error, committed, snapshot) {
          if (error || !committed) {
            that.findDeck(gameRef);
          } else {
            gameRef.update({ deckId: snapshot.key() });
            that.setState({ creatingGame: false });
          }
        }, false);
      });
    });
  },
  createGame: function () {
    this.setState({ creatingGame: true });
    var gameRef = this.gamesRef.push({
      players: {
        0: this.props.user
      }
    });
    this.findDeck(gameRef);
  },
  componentWillMount: function () {
    this.gamesRef = FirebaseRefs.games;
    this.gamesRef.on("child_added", this.firebaseChangeHandler());
    this.gamesRef.on("child_changed", this.firebaseChangeHandler());
    this.gamesRef.on("child_removed", this.firebaseChangeHandler(true));
  },
  getInitialState: function() {
    return { games: this.games };
  },
  render: function() {
      var games = [];
      for (var gameKey in this.state.games) {
        var game = this.state.games[gameKey];
        if (game.deckId) {
          games.push (
            <GameDescription shown={this.props.shownGameId===gameKey} game={game} gameId={gameKey} key={gameKey} user={this.props.user} handleShow={this.props.handleShow}/>
          );
        }
      }
      return (
          <div className="games">
            <div className="create">
               <input type="button" value="Create!" onClick={this.createGame} disabled={this.state.creatingGame ? 'disabled' : ''}/>
            </div>
            {games}
          </div>
        );
  }
});

module.exports = GamesList;

