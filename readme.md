#L.Control.NorkartSearch

L.Control.NorkartSearch is a [Leaflet][1] plugin for using the address search from Norkart. Requires an API-key.

## Usage

    L.control.norkartSearch({
        apiKey: 'MY_API_KEY'
    }).addTo(map);

## Options

    apiKey: an api key from norkart,
    position: a [leaflet control position][2]. Default: 'topright'
    placeholder: placeholder text for search textbox
    showMarker: show a marker in the map when a hit is selected

## Events

    the plugin triggers a ```search:select``` event on the map when a hit is selected.

    map.on('search:select', function(event) {
        var position = event.position; // a L.latLng
        var element = event.element; // The raw data from the search API
    });


### As a standalone component

Make sure to have the following components available on your page

- [Leaflet][1]
- [Bootstrap][3] (css only)
- [Reqwest][4]
- [React & ReactDOM][5]


[1]: http://leafletjs.com
[2]: http://leafletjs.com/reference.html#control-positions
[3]: http://getbootstrap.com
[4]: https://github.com/ded/reqwest
[5]: https://facebook.github.io/react/downloads.html

And include the ```L.Control.NorkartSearch.js``` and ```L.Control.NorkartSearch.css``` from ```/build/```.

See ```demo/index.html``` for an example.


### As an mpm-module

Install:

    npm install leaflet-norkartsearch --save

In code:

    require('leaflet-norkartsearch ');


### Demo

