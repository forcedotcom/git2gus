const getByRelatedUrl = require('../getByRelatedUrl');

global.Issues = {
    findOne: jest.fn(),
};

describe('getByRelatedUrl issues service', () => {
    it('should call Issues.findOne with the right value', () => {
        getByRelatedUrl('github/john-doe/test-app');
        expect(Issues.findOne).toHaveBeenCalledWith({
            relatedUrl: 'github/john-doe/test-app',
        });
    });
});
