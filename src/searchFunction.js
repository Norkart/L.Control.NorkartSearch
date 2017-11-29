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

function search(text, targets, extraHeaders, callback) {
      var baseUrl = '//www.webatlas.no/WAAPI-FritekstSok/suggest/kommunecustom/?Targets=';
      var targetString=targets.join(',');
      var url = baseUrl + targetString +'&Query=' + text;

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
            console.log('Error in search');
            callback(err);
        },
        success: function (resp) {
            callback(null, resp.Options);
        }
    });
}

module.exports = search;
