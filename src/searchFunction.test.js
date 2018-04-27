import {searchAppBackend, searchApiKey} from './searchFunction';
import reqwest from 'reqwest';

beforeEach(() => {
    reqwest.mockClear();
    //reqwest.mockRestore();
});


describe('searchApiKey', () => {
    xit('is defined', () => {
        expect(searchApiKey).toBeDefined();
    });

   it('sets correct search term', () => {
        searchApiKey('test', ['target1'], null, 'apiKey', jest.fn());

        //check that we called reqwest once
        expect(reqwest.mock.calls.length).toBe(1);

        //get the args reqwest was called with
        const args = reqwest.mock.calls[0][0];
        expect(args.url).toBe('//www.webatlas.no/WAAPI-FritekstSok/suggest/kommunecustom/?Query=test&Targets=target1');

    });

    it('encodes øæå in  search term', () => {
        searchApiKey('øæå', ['target1'], null, 'apiKey', jest.fn());

        expect(reqwest.mock.calls.length).toBe(1);
        const args = reqwest.mock.calls[0][0];
        expect(args.url).toBe('//www.webatlas.no/WAAPI-FritekstSok/suggest/kommunecustom/?Query=%C3%B8%C3%A6%C3%A5&Targets=target1');
    });

    it('sets correct targets', () => {
        searchApiKey('test', ['target1', 'target2'], null, 'apiKey', jest.fn());

        expect(reqwest.mock.calls.length).toBe(1);
        const args = reqwest.mock.calls[0][0];
        expect(args.url).toBe('//www.webatlas.no/WAAPI-FritekstSok/suggest/kommunecustom/?Query=test&Targets=target1%2Ctarget2');
    });

    it('sets correct limits', () => {
        searchApiKey('test', ['target1', 'target2'], ['limit1', 'limit2'], 'apiKey', jest.fn());

        expect(reqwest.mock.calls.length).toBe(1);
        const args = reqwest.mock.calls[0][0];
        expect(args.url).toBe('//www.webatlas.no/WAAPI-FritekstSok/suggest/kommunecustom/?Query=test&Targets=target1%2Ctarget2&kommuneLimit=limit1%2Climit2');
    });

    it('sets correct headers', () => {
        searchApiKey('test', ['target1', 'target2'], ['limit1', 'limit2'], 'apiKey', jest.fn());

        expect(reqwest.mock.calls.length).toBe(1);
        const args = reqwest.mock.calls[0][0];
        expect(args.headers['X-WAAPI-Token']).toBe('apiKey');
    });

    it('calls the callback', done => {

        function cb(err, data) {
            expect(data).toEqual([]);
            done();
        }

        searchApiKey('test', ['target1', 'target2'], ['limit1', 'limit2'], 'apiKey', cb);
    });

});

describe('searchAppBackend', () => {
    it('is defined', () => {
        expect(searchAppBackend).toBeDefined();
    });
});