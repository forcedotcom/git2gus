const getGusItemUrl = require('../getGusItemUrl');

describe('getGusItemUrl issues service', () => {
    it('should retrun the right gus item url', () => {
        const gusItemUrl = getGusItemUrl({
            sfid: 'qwerty1234',
        });
        expect(gusItemUrl).toBe('https://gus.lightning.force.com/lightning/r/ADM_Work__c/qwerty1234/view');
    });
});
