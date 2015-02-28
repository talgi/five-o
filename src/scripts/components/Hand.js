
'use strict';

var React = require('react');
var FirebaseRefs = require('../services/FirebaseRefs');
var ReactFireMixin = require('reactfire');
var Card = require('./Card');


var Hand = React.createClass({
  mixins: [ReactFireMixin],
  handSelected: function () {
    if (this.props.clickable) {
      this.props.onHandSelected(this.props.handNumber);
    }
  },
  getInitialState: function() {
    return {};
  },
  isCardHidden: function (cardIndex) {
    return !this.props.gameOver && !this.props.myHand && (5===cardIndex);
  },
  isCardUpside: function (cardIndex) {
    return !this.props.gameOver && this.props.myHand && (5===cardIndex);
  },
  render: function() {
      var cardIndex = 0;
      var cards = Object.keys(this.props.hand).map(function (key) {
        cardIndex++;
        return (<Card key={key} number={this.props.hand[key]} hidden={this.isCardHidden(cardIndex)} upside={this.isCardUpside(cardIndex)}/>);
      }.bind(this));
      return (
        <div className={'hand '+(this.props.clickable ? 'clickable':'')} onClick={this.handSelected}>
          {cards}
        </div>);
  }
});

module.exports = Hand;
