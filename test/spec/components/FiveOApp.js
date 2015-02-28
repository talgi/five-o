'use strict';

describe('Main', function () {
  var React = require('react/addons');
  var FiveOApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    FiveOApp = require('../../../src/scripts/components/FiveOApp.js');
    component = React.createElement(FiveOApp);
  });

  it('should create a new instance of FiveOApp', function () {
    expect(component).toBeDefined();
  });
});
