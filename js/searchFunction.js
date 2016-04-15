'use strict';
var _ = require('underscore');
var $ = require('jquery');

function fixResults(res) {
    return _.map(res.Options, function (option) {
        return {text: option.Text, id: option.PayLoad.AdresseId, pos: option.PayLoad.Posisjon};
    });
}

function search(text, token, callback) {
    var url = 'http://www.webatlas.no:80/WAAPI-FritekstSok/suggest/matrikkel/adresse?Query=' + text;
    $.ajax({
        url: url,
        success: function (res) {
            callback(null, fixResults(res));
        },
        headers: {
            'Accept': 'application/json; charset=utf-8',
            'X-WAAPI-Token': token
        },
        error: function (e) {
            //onError();
            console.error(e);
        },
        dataType: 'json'
    });
}

module.exports = search;