'use strict';
var L = require('leaflet');
var React = require('react');
var ReactDOM = require('react-dom');

require('./searchplugin.css');

var SearchBox = require('./SearchBox');

L.Control.NorkartSearch = L.Control.extend({

    options: {
        position: 'topright',
        placeholder: 'Søk',
        showMarker: true,
        closeOnSelect: true
    },

    onAdd: function (map) {
        var className = 'leaflet-control-search',
            container = L.DomUtil.create('div', className),
            options = this.options;
        this.map = map;
        ReactDOM.render(
            <SearchBox
                NkAuth={options.NkAuth}
                apiKey={options.apiKey}
                placeholder={options.placeholder}
                closeOnSelect={options.closeOnSelect}
                hitSelected={this.hitSelected.bind(this)} />,
            container
        );

        var stop = L.DomEvent.stopPropagation;
        var fakeStop = L.DomEvent._fakeStop || stop;
        L.DomEvent
            .on(container, 'contextmenu', stop)
            .on(container, 'click', fakeStop)
            .on(container, 'mousedown', stop)
            .on(container, 'touchstart', stop)
            .on(container, 'dblclick', fakeStop)
            .on(container, 'mousewheel', stop)
            .on(container, 'MozMousePixelScroll', stop);

        return container;
    },

    hitSelected: function (hit) {
        var pos = L.latLng(hit.PayLoad.Posisjon.Y, hit.PayLoad.Posisjon.X);
        this.map.fire('search:select', {position: pos, element: hit});
        if (!this.options.showMarker) {
            return;
        }

        if (this.marker) {
            this.map.removeLayer(this.marker);
        }
        this.marker = L.marker(pos).addTo(this.map);
        this.map.setView(pos, 16);
    }
});

L.control.norkartSearch = function (options) {
    return new L.Control.NorkartSearch(options);
};

