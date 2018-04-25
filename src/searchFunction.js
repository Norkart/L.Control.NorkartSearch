import reqwest from 'reqwest';

function extend(to, from) {
   for (var key in from) {
        if (from.hasOwnProperty(key)) {
            to[key] = from[key];
        }
   }
   return to;
}

function search(text, targets, limits, extraHeaders, callback) {
      var baseUrl = '//www.webatlas.no/WAAPI-FritekstSok/suggest/kommunecustom/?Targets=';
      var targetString = targets.join(',');
      var limitsString = (limits) ? '&kommuneLimit=' + limits.join(',') : '';
      var url = baseUrl + targetString + limitsString + '&Query=' + text;

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