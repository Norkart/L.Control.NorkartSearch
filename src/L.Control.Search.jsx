'use strict';
var L = require('leaflet');
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');

require('./searchplugin.css');

var SearchBox = require('./SearchBox.jsx');

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
            <SearchBox NkAuth={options.NkAuth} apiKey={options.apiKey} hitSelected={_.bind(this._hitSelected, this)} />,
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
    }
});

L.control.search = function (options) {
    return new L.Control.Search(options);
};
