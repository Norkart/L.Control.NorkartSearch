'use strict';
require('leaflet_css');
require('leaflet_marker');
require('leaflet_marker_2x');
require('leaflet_marker_shadow');

var L = require('leaflet');

var TileLayer = require('leaflet-webatlastile').WebatlasTileLayer;
var tileLayer = require('leaflet-webatlastile').webatlasTileLayer;


function setupMap(div, apiKey) {

    var map = L.map(div).setView([63.505, 10.09], 13);
    var l = new tileLayer({
        mapType: TileLayer.Type.VECTOR,
        apikey: apiKey
    }).addTo(map);
    return map;
}

module.exports = setupMap;