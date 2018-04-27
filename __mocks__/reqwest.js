
const mockRequest = jest.fn(args => {
    //console.log("!!!", args);
    args.success({Options: []});
});

export default mockRequest;
/*

export default function(args) {
    args.success({Options: []});
}
*/
/*
const reqwest = jest.genMockFromModule('reqwest');

export default reqwest;*/