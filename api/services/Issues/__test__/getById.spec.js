const getById = require('../getById');

global.Issues = {
    findOne: jest.fn()
};

describe('getById issues service', () => {
    it('should call Issues.findOne with the right value', () => {
        getById('issue-135');
        expect(Issues.findOne).toHaveBeenCalledWith({
            id: 'issue-135'
        });
    });
});
