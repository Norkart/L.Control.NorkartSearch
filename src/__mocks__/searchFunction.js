const searchApiKey = jest.fn(function (text, targets, limits, extraHeaders, callback) {
    if (text === 'test') {
        const data = [
            {Id: 1, Text: 'test 1'},
            {Id: 2, Text: 'test 2'},
            {Id: 3, Text: 'test 3'}
        ];
        callback(null, data);
    } else if (text === 'test_err') {
        callback('Error from mock');
    } else if (text === 'test_nores') {
        callback(null, []);
    }
});

const searchAppBackend = jest.fn();

export {searchAppBackend, searchApiKey};