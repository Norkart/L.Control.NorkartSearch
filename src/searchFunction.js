'use strict';
var _ = require('underscore');

var reqwest = require('reqwest');

function fixResults(res) {
    return _.map(res.Options, function (option) {
        return {text: option.Text, id: option.PayLoad.AdresseId, pos: option.PayLoad.Posisjon};
    });
}

function search(text, extraHeaders, callback) {
    //var url = 'http://www.webatlas.no:80/WAAPI-FritekstSok/suggest/matrikkel/adresse?Query=' + text;
    var url = '//tvm-webatlashar/WAAPI-FritekstSok/suggest/matrikkel/adresse?Query=' + text;

    var headers = _.extend(
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
            callback(null, fixResults(resp));
        }
    });
}

module.exports = search;