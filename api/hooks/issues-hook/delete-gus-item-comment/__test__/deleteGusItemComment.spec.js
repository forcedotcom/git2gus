const deleteGusItemComment = require('..');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByRelatedUrl: jest.fn(),
    update: jest.fn()
}));
const task = {
    relatedUrl: 'github/test-app/#230',
    comment: {
        url: 'https://test.com/1',
        body: 'test comment'
    }
};

describe('deleteGusItemComment issues hook', () => {
    it('should call Issues.getByRelatedUrl with the right value', () => {
        deleteGusItemComment(task);
        expect(Issues.getByRelatedUrl).toHaveBeenCalledWith(
            'github/test-app/#230'
        );
    });
    it('should call Issues.update with the right values when the issue is linked', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234abcd',
                comments: [
                    {
                        url: 'https://test.com/1',
                        body: 'test comment'
                    }
                ]
            })
        );
        await deleteGusItemComment(task);
        expect(Issues.update).toHaveBeenCalledWith('1234abcd', {
            comments: []
        });
    });
    it('should not call Issues.update when the issue is not linked', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(Promise.resolve(null));
        await deleteGusItemComment(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
