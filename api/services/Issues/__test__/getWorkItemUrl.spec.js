const getWorkItemUrl = require('../getWorkItemUrl');

describe('getWorkItemUrl issues service', () => {
    it('should retrun the right work item url', () => {
        const gusItemUrl = getWorkItemUrl({
            sfid: 'qwerty1234'
        });
        expect(gusItemUrl).toBe(
            'https://gus.lightning.force.com/lightning/r/ADM_Work__c/qwerty1234/view'
        );
    });
});
