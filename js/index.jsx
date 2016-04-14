'use strict';
require('bootstrap/dist/css/bootstrap.css');
require('@norkart/bootstrap-override/bootstrap-override.css');
require('./../css/style.css');
var ReactDOM = require('react-dom');
var React = require('react');


var MyMap = require('./MyMap.jsx');

var Myreactcomponent = require('./myreactcomponent.jsx');


ReactDOM.render(
    <Myreactcomponent title="Hello world"/>,
    document.getElementById('header')
);


ReactDOM.render(
    <MyMap/>,
    document.getElementById('map')
);

