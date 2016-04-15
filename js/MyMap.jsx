'use strict';

var React = require('react');
var setupMap = require('./map.js');
var ReactDOM = require('react-dom');
var SearchBox = require('./SearchBox.jsx');

L.Icon.Default.imagePath = 'bundles/images/';

var MyMap = React.createClass({

    componentDidMount: function () {
        var div = ReactDOM.findDOMNode(this);
        this.map = setupMap(div, this.props.apiKey);
    },

    hitSelected: function (hit) {
        var pos = [hit.pos.Y, hit.pos.X];
        L.marker(pos).addTo(this.map);
        this.map.setView(pos, 16);
    },

    render: function () {
        return (
            <div className="map">
                <SearchBox apiKey={this.props.apiKey} hitSelected={this.hitSelected} />
            </div>
        );
    }
});

module.exports = MyMap;