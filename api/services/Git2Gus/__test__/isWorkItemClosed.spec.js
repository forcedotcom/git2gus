const isWorkItemClosed = require('../isWorkItemClosed');

global.sails = {
    config: {
        salesforce: {
            status: ['INTEGRATE', 'FIXED', 'CLOSED']
        }
    }
};

describe('isWorkItemClosed git2gus service', () => {
    it('should return true when status is closed', () => {
        const labels = ['INTEGRATE', 'FIXED', 'CLOSED'];
        labels.forEach(label => {
            expect(isWorkItemClosed(label)).toBe(true);
        });
    });
    it('should return false when not a valid closed status is passed', () => {
        expect(isWorkItemClosed('other status')).toBe(false);
    });
});
