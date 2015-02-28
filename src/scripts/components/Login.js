'use strict';

var React = require('react');
var FirebaseRefs = require('../services/FirebaseRefs');

var login = React.createClass({
  componentWillMount: function () {
    var authData = FirebaseRefs.base.getAuth();
    if (authData) {
      this.handleUserAuth(authData);
    }
  },
  handleUserAuth: function (authData, name) {
    var callback = this.props.onLogin;
    FirebaseRefs.online.on('value', function (snapshot) {
      if (snapshot.val()) {
        var userRef = FirebaseRefs.userRef(authData.uid);
        userRef.child('online').onDisconnect().remove();
        userRef.update({ online: true });
        if (name) {
          userRef.update({ name: name });
          callback(name, authData.uid);
        } else {
          userRef.child('name').once('value', function (snapshot) {
            callback(snapshot.val(), authData.uid);
          });
        }

      }
    });
  },
  handleSignup: function (e) {
    this.setState({submitting: true});
    var that = this;
    FirebaseRefs.base.createUser({
      email    : this.refs.email.getDOMNode().value,
      password : this.refs.pass.getDOMNode().value
    }, function(error, authData) {
      if (error === null) {
        that.handleUserAuth(authData, that.refs.name.getDOMNode().value);
      } else {
        that.setState({ error: error });
        that.setState({submitting: false });
      }
    });
    e.preventDefault();
  },
  handleLogin: function (e) {
    this.setState({submitting: true});
    var that = this;
    FirebaseRefs.base.authWithPassword({
      email    : this.refs.email.getDOMNode().value,
      password : this.refs.pass.getDOMNode().value
    }, function(error, authData) {
      if (error === null) {
        that.handleUserAuth(authData);
      } else {
        that.setState({ error: error });
        that.setState({submitting: false });
      }
    });
    e.preventDefault();
  },
  setSignup: function () {
    this.setState({ signup: true });
    return false;
  },
  setSignin: function () {
    this.setState({ signup: false });
    return false;
  },
  getInitialState: function() {
    return { signup: false };
  },
  error: function () {
    return this.state.error ? (<label>{this.state.error}</label>) : '';
  },
  render: function() {
      var name = this.state.signup ? <input type="text" placeholder="name" ref="name" /> : '';
      var toggle = this.state.signup ? <div>Already have a user? <a href='#' onClick={this.setSignin}>SignIn</a></div> :
        <div>Don't have a user? <a href='#' onClick={this.setSignup}>Sign Up</a></div>;
      return (
          <form className="loginForm" onSubmit={this.state.signup ? this.handleSignup : this.handleLogin}>
            <div>{name}</div>
            <div><input type="email" placeholder="email" ref="email" /></div>
            <div><input type="password" placeholder="password" ref="pass" /></div>
            <div><input type="submit" value={this.state.signup ? 'Signup' : 'Login'} disabled={this.state.submitting}/></div>
            <div>{this.state.error}</div>
            <div>{toggle}</div>
          </form>
        );

  }
});

module.exports = login;
