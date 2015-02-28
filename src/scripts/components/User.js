
'use strict';

var React = require('react');
var FirebaseRefs = require('../services/FirebaseRefs');
var ReactFireMixin = require('reactfire');

require('../../styles/user.scss');


var User = React.createClass({
  mixins: [ReactFireMixin],
  initUser: function (userId) {
    this.bindAsObject(FirebaseRefs.userRef(userId), "user");
  },
  componentWillMount: function () {
    this.initUser(this.props.userId);
  },
  componentWillReceiveProps: function (newProps) {
    if (newProps.userId !== this.props.userId) {
      this.unbind("user");
      this.initUser(newProps.userId);
    }
  },
  getInitialState: function() {
    return {};
  },
  render: function() {
      if (!this.state.user)  { return <div></div>; }
      return (
        <div className="user">
          <span className={this.state.user.online ? "online" : "offline"}></span><span>{this.state.user.name}</span>
        </div>
        );
  }
});

module.exports = User;
