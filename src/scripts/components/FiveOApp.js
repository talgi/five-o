'use strict';

var React = require('react');
var Firebase = require('firebase');
var ReactFireMixin = require('reactfire');
var Login = require('./login');
var Game = require('./Game');
var GamesList = require('./GamesList');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');


var FiveOApp = React.createClass({
  mixins: [ReactFireMixin],
  handleLogin: function (name, id) {
    this.setState({ loggedIn: true, user: { name:name, id: id} });
  },
  getInitialState: function() {
    return {loggedIn: false};
  },
  handleShow: function(gameId, deckId) {
    this.setState({shownGameId: gameId, shownDeckId: deckId});
  },
  render: function() {
    if (this.state.loggedIn) {
      var game = this.state.shownGameId ? <Game gameId={this.state.shownGameId} deckId={this.state.shownDeckId} userID={this.state.user.id} /> : '';
      return (
        <div>
          <GamesList user={this.state.user} handleShow={this.handleShow} shownGameId={this.state.shownGameId}/>
          <div className='main'>
            {game}
          </div>
        </div>
        );
    } else {
      return (
        <div className='main'>
          <Login onLogin={this.handleLogin}/>
        </div>
        );
    }

  }
});

module.exports = FiveOApp;
