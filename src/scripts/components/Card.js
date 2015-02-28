
'use strict';

var React = require('react');

require('../../styles/card.scss');


var Card = React.createClass({
  render: function() {
      return (
        <div className={'card value-' + this.props.number +
                        ' ' + (this.props.hidden ? 'hidden' : '') +
                        ' ' + (this.props.upside ? 'upside' : '')}>
        </div>
        );
  }
});

module.exports = Card;
