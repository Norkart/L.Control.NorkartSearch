'use strict';

var React = require('react');
var setupMap = require('./map.js');
var ReactDOM = require('react-dom');


require('../src/L.Control.Search.jsx');


L.Icon.Default.imagePath = 'bundles/images/';

var MyMap = React.createClass({

    componentDidMount: function () {
        var div = ReactDOM.findDOMNode(this);
        this.map = setupMap(div, this.props.apiKey);
        L.control.search({NkAuth: this.props.NkAuth}).addTo(this.map);
    },

    render: function () {
        return (
            <div className="map">
            </div>
        );
    }
});

module.exports = MyMap;