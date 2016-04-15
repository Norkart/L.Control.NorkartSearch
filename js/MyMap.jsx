'use strict';

var React = require('react');
var setupMap = require('./map.js');
var ReactDOM = require('react-dom');
var SearchBox = require('./SearchBox.jsx');
var _ = require('underscore');

L.Icon.Default.imagePath = 'bundles/images/';


L.Control.Search = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function (map) {
        var className = 'leaflet-control-search',
            container = L.DomUtil.create('div', className),
            options = this.options;
        this.map = map;
        ReactDOM.render(
            <SearchBox apiKey={options.apiKey} hitSelected={_.bind(this._hitSelected, this)} />,
            container
        );

        return container;
    },

    _hitSelected: function (hit) {
        var pos = [hit.pos.Y, hit.pos.X];
        if (this.marker) {
            this.map.removeLayer(this.marker);
        }
        this.marker = L.marker(pos).addTo(this.map);
        this.map.setView(pos, 16);
    },

    onRemove: function (map) {
    }
});


// @factory L.control.scale(options?: Control.Scale options)
// Creates an scale control with the given options.
L.control.search = function (options) {
    return new L.Control.Search(options);
};


var MyMap = React.createClass({

    componentDidMount: function () {
        var div = ReactDOM.findDOMNode(this);
        this.map = setupMap(div, this.props.apiKey);
        L.control.search({apiKey: this.props.apiKey}).addTo(this.map);
    },

    render: function () {
        return (
            <div className="map">
            </div>
        );
    }
});

module.exports = MyMap;