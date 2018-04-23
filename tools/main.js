import '../src';
import '../dist/style.css'; // import this from dist, will be copied there on change

var apiKey = '07C4A129-9D26-4B3D-9BC8-B22E4B6E509E'; //DO NOT USE THIS KEY: DEMO ONLY
var map = L.map('map').setView([65.505, 20.09], 5);

L.tileLayer.webatlas({apikey: apiKey, mapType: L.TileLayer.Webatlas.Type.VECTOR}).addTo(map);

L.control.norkartSearch({
    apiKey: apiKey
}).addTo(map);

map.on('search:select', function (e) {
    console.log(e);
});