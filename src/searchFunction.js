import reqwest from 'reqwest';

const BASE_URL = '//www.webatlas.no/WAAPI-FritekstSok/suggest/kommunecustom/';

function extend(to, from) {
   for (var key in from) {
        if (from.hasOwnProperty(key)) {
            to[key] = from[key];
        }
   }
   return to;
}

function buildQueryString(params) {

    return Object.keys(params).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    ).join('&');

}

function search(text, targets, limits, extraHeaders, callback) {
    var params = {
        'Query': text,
        'Targets': targets.join(',')
    };
    if (limits) {
        params['kommuneLimit'] = limits.join(',');
    }

    var headers = extend(
        {'Accept': 'application/json; charset=utf-8'},
        extraHeaders
    );
    reqwest({
        url: `${BASE_URL}?${buildQueryString(params)}`,
        crossOrigin: true,
        type: 'json',
        method: 'get',
        contentType: 'application/json',
        headers: headers,
        error: function (err) {
            console.error('Error in search');
            callback(err);
        },
        success: function (resp) {
            callback(null, resp.Options);
        }
    });
}

function searchAppBackend(value, targets, limits, auth, gotResults) {
    auth.getToken(function (err, token) {
        var h = {
            'Authorization': 'Bearer ' + token,
            'X-WAAPI-Profile': auth.config.profile
        };
        search(value, targets, limits, h, gotResults);
    });
}

function searchApiKey(value, targets, limits, token, gotResults) {
    var h = {'X-WAAPI-Token': token};
    search(value, targets, limits, h, gotResults);
}

export {searchAppBackend, searchApiKey};