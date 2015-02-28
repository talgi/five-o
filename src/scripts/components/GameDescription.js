'use strict';

var React = require('react');
var FirebaseRefs = require('../services/FirebaseRefs');
var User = require('./User');

var GameDescription = React.createClass({
  handleJoin: function () {
    var game = this.props.game;
    if (this.isGameOpen() && !this.isInGame()) {
      var updateObj = {};
      updateObj[game.players.length] = this.props.user;
      FirebaseRefs.gameRef(this.props.gameId).child('players').update(updateObj);
    }
    this.props.handleShow(this.props.gameId, this.props.game.deckId);
  },
  handleShow: function () {

  },
  componentWillMount: function () {

  },
  getInitialState: function() {
    return {  };
  },
  isGameOpen: function () {
    var game = this.props.game;
    return (game.players && Object.keys(game.players).length < 2);
  },
  isInGame: function () {
    var game = this.props.game;
    return (game.players && ((game.players[0] && game.players[0].id === this.props.user.id) || (game.players[1] && game.players[1].id === this.props.user.id)));
  },
  render: function() {
      var game = this.props.game;
      var players = (
          <div>
            {(game.players && game.players[0]) ? <User userId={game.players[0].id}/> : <div>?</div>} VS {(game.players && game.players[1]) ? <User userId={game.players[1].id}/> : <div>?</div>}
          </div>
        );

      var status = this.isGameOpen() ?  (this.isInGame() ? 'Waiting for other players...' : 'Open!') : (game.turn >= 50 ? 'Complete!' : 'Running!');

      return (
          <div className={"gamedesc" + (this.props.shown ? ' shown' :'')} onClick={this.handleJoin}>
            <div className='status'>{status}</div>
            <div className='players'>{players}</div>
          </div>
        );
  }
});

module.exports = GameDescription;
