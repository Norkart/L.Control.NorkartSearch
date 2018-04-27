const mockRequest = jest.fn(args => {
    args.success({Options: []});
});

export default mockRequest;