
const linkToGusItem = require('../');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByName: jest.fn(),
    update: jest.fn(),
}));
const task = {
    relatedUrl: 'github/test-app/#46',
    gusItemName: '12345',
};

describe('linkToGusItem issues hook', () => {
    it('should call Issues.getByName with the right value', () => {
        linkToGusItem(task);
        expect(Issues.getByName).toHaveBeenCalledWith('12345');
    });
    it('should call Issues.update with the right values when the issue already exists', async () => {
        expect.assertions(1);
        Issues.getByName.mockReset();
        Issues.update.mockReset();
        Issues.getByName.mockReturnValue(Promise.resolve({
            id: '1234qwerty',
        }));
        await linkToGusItem(task);
        expect(Issues.update).toHaveBeenCalledWith('1234qwerty', {
            relatedUrl: 'github/test-app/#46',
        });
    });
    it('should not call Issues.update when the issue does not exists', async () => {
        expect.assertions(1);
        Issues.getByName.mockReset();
        Issues.update.mockReset();
        Issues.getByName.mockReturnValue(null);
        await linkToGusItem(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
