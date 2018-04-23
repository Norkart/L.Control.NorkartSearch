import React from 'react';
import ReactDOM from 'react-dom';

//import './style.css';
import  SearchBox from './SearchBox';

var L = window.L;

L.Control.NorkartSearch = L.Control.extend({

    options: {
        position: 'topright',
        placeholder: 'Søk',
        showMarker: true,
        closeOnSelect: true,
        targets: ['matrikkelenhet', 'gateadresse']
    },

    initialize: function (options) {
        options = options || {};
        L.setOptions(this, options);
        if (options.hitSelected) {
            this.hitSelected = options.hitSelected.bind(this);
        } else {
            this.hitSelected = this._defaulthitSelected.bind(this);
        }
    },

    onAdd: function (map) {
        var className = 'leaflet-control-search',
            container = L.DomUtil.create('div', className);
        this.map = map;
        this._renderSearch(container);

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
        this.container = container;
        return container;
    },

    clearSearchBox: function () {
        this._renderSearch(this.container);
        if (this.marker) {
            this.map.removeLayer(this.marker);
        }
    },

    _renderSearch: function (container) {
        var options = this.options;
        ReactDOM.render(
            <SearchBox
                key={Date.now()}
                NkAuth={options.NkAuth}
                apiKey={options.apiKey}
                targets={options.targets}
                placeholder={options.placeholder}
                closeOnSelect={options.closeOnSelect}
                hitSelected={this.hitSelected} />,
            container
        );
    },

    _defaulthitSelected: function (hit) {
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
