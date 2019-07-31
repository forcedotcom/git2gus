const getWorkItemUrl = require('../getWorkItemUrl');

describe('getWorkItemUrl issues service', () => {
    it('should retrun the right work item url', () => {
        process.env.WORK_ITEM_BASE_URL =
            'https://gus.lightning.force.com/lightning/r/ADM_Work__c/';
        const workItemUrl = getWorkItemUrl({
            sfid: 'qwerty1234'
        });
        expect(workItemUrl).toBe(
            'https://gus.lightning.force.com/lightning/r/ADM_Work__c/qwerty1234/view'
        );
    });
});
