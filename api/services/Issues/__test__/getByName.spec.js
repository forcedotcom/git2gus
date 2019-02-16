const getByName = require('../getByName');

global.Issues = {
    findOne: jest.fn(),
};

describe('getByName issues service', () => {
    it('should call Issues.findOne with the right value', () => {
        getByName('abcd1234');
        expect(Issues.findOne).toHaveBeenCalledWith({
            name: 'abcd1234',
        });
    });
});
