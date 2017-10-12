'use strict';

var reqwest = require('reqwest');

function extend(to, from) {
   for (var key in from) {
        if (from.hasOwnProperty(key)) {
            to[key] = from[key];
        }
   }
   return to;
}


function search(text, extraHeaders, callback) {
    var url = '//www.webatlas.no/WAAPI-FritekstSok/suggest/kommunecustom/adresse?Targets=gateadresse,matrikkelenhet&Query=' + text;

    var headers = extend(
        {'Accept': 'application/json; charset=utf-8'},
        extraHeaders
    );

    reqwest({
        url: url,
        crossOrigin: true,
        type: 'json',
        method: 'get',
        contentType: 'application/json',
        headers: headers,
        error: function (err) {
            callback(err);
        },
        success: function (resp) {
            callback(null, resp.Options);
        }
    });
}

module.exports = search;
