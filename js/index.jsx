'use strict';
require('bootstrap/dist/css/bootstrap.css');
require('@norkart/bootstrap-override/bootstrap-override.css');
require('./../css/style.css');
var ReactDOM = require('react-dom');
var React = require('react');
var config = require('./config');
var MyMap = require('./MyMap.jsx');

ReactDOM.render(
    <MyMap apiKey={config.apiKey} />,
    document.getElementById('map')
);

