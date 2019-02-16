const getAll = require('../getAll');

global.Issues = {
    find: jest.fn(() => ({
        limit: jest.fn(),
    })),
};

describe('getAll issues service', () => {
    it('should call Issues.find with the right value', () => {
        getAll();
        expect(Issues.find).toHaveBeenCalledWith({});
    });
    it('should Issues.find().limit with the right value', () => {
        global.Issues.find.mockReset();
        global.Issues.find.mockReturnValue({
            limit: jest.fn(),
        });
        getAll();
        expect(Issues.find().limit).toHaveBeenCalledWith(25);
    });
});
