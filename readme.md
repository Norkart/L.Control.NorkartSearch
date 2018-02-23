# L.Control.NorkartSearch

L.Control.NorkartSearch is a [Leaflet][1] plugin for using the address search from Norkart. Requires an API-key.

## Usage

    L.control.norkartSearch({
        apiKey: 'MY_API_KEY'
    }).addTo(map);

## Options

| option      | Type   | Default | Description             |
|-------------|--------|---------|------------------------ |
| apiKey      | string |   none  | an api key from Norkart |
| position    | [leaflet control position][2] | 'topright' | position of the leaflet control       |
| placeholder | string | Søk   | placeholder text for search box
| showMarker  | boolean| true   | Wether or not to show a marker in the map when a hit is selected
| limits  | array<String>| undefined  | array of municipality id's (kommunenummer) to limit search to |
| targets     | array<String> | ['matrikkelenhet', 'gateadresse'] | target names that determines what type of search the engine supports. Supported targets are: 'matrikkelenhet', 'gateadresse', 'stedsnavn' (and more, see [fritektsook api](http://www.webatlas.no/WAAPI-FritekstSok/swagger-ui/#!/suggest/CustomKommuneSuggestionRequest)).
<!-- |onFocus| boolean | false | Wether or not the searchbox should be automatically selected (focused) when the page is loaded -->


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


### As an npm-module

Install:

    npm install @norkart/leaflet-norkartsearch --save

In code:

    require('leaflet-norkartsearch');


### Demo

See <https://norkart.github.io/L.Control.NorkartSearch/demo/> for a simple example


### Contribute

##### Install dependencies:
```npm install```

##### Run code:
Run the demo code by running:
```npm start``` and go to ```localhost:8080```
