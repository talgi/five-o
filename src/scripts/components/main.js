'use strict';

var FiveOApp = require('./FiveOApp');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

//var DecksGenerator = require('../services/DecksGenerator');
//DecksGenerator.generateDeck();

var content = document.getElementById('content');



var Routes = (
  <Route handler={FiveOApp}>
  </Route>
);

Router.run(Routes, function (Handler) {
  React.render(<Handler/>, content);
});
