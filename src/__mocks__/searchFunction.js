export default jest.fn(function (text, targets, limits, extraHeaders, callback) {
    if (text === 'test') {
        const data = [
            {Id: 1, Text: 'test 1'},
            {Id: 2, Text: 'test 2'},
            {Id: 3, Text: 'test 3'}
        ];
        callback(null, data);
    } else if (text === 'test_nores') {
        callback(null, []);
    }
});