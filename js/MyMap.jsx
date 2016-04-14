'use strict';

var React = require('react');
var setupMap = require('./map.js');
var ReactDOM = require('react-dom');
var SearchBox = require('./SearchBox.jsx');

var MyMap = React.createClass({

    componentDidMount: function () {
        var div = ReactDOM.findDOMNode(this);
        setupMap(div, '84225b7d-7219-4fe2-aa96-f32af3d81c26');
    },

    render: function () {
        return (
            <div className="map">
                <SearchBox />
            </div>
        );
    }
});

module.exports = MyMap;