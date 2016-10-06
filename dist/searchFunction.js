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

function search(text, extraHeaders, baseurls, callback) {
    var baseurl = baseurls.pop();
    if (baseurl === undefined) {
        return;
    }
    searchRequest(text, extraHeaders, baseurl, function (err, resp) {
        if (err) {
            callback(err);
        }

        var searchResults = null;
        //differentiate between Options and SearchResults coming from /search and /suggest 
        if (resp.hasOwnProperty('Options')) {
            searchResults = resp.Options;
        }
        if (resp.hasOwnProperty('SearchResults')) {
            searchResults = resp.SearchResults;
        }

        if (searchResults.length > 0) {
            console.log("RESULT!", searchResults, baseurl, baseurls);
            console.log(callback);
            callback(null, searchResults);
        } else {
            search(text, extraHeaders, baseurls, callback);
        }
    });
}

function searchRequest(text, extraHeaders, baseurl, callback) {
    //var url = '//www.webatlas.no/WAAPI-FritekstSok/suggest/matrikkel/adresse?Query=' + text;
    var url = baseurl + text;
    var headers = extend({ 'Accept': 'application/json; charset=utf-8' }, extraHeaders);
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
            callback(null, resp);
        }
    });
}

module.exports = search;