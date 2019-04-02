const integrateGusItem = require('../');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByRelatedUrl: jest.fn(),
    update: jest.fn()
}));
const payload = {
    relatedUrl: 'github/test-app/#45',
    status: 'INTEGRATE'
};

describe('integrateGusItem issues hook', () => {
    it('should call Issues.update with the right values when the issue exists', async () => {
        expect.assertions(1);
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234qwerty',
                status: 'NEW'
            })
        );
        await integrateGusItem(payload);
        expect(Issues.update).toHaveBeenCalledWith('1234qwerty', {
            status: 'INTEGRATE'
        });
    });
    it('should not call Issues.update when the issue does not exists', async () => {
        expect.assertions(1);
        Issues.getByRelatedUrl.mockReset();
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(null);
        await integrateGusItem(payload);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
