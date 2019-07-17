const isSalesforceUserStoryLabel = require('../isSalesforceUserStoryLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels: ghLabels
    }
};

describe('isSalesforceUserStoryLabel github service', () => {
    it('should return true when a USER STORY label is passed', () => {
        const label = 'USER STORY';
        expect(isSalesforceUserStoryLabel(label)).toBe(true);
    });
    it('should return false when not a USER STORY label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'Salesforce'];
        labels.forEach(label => {
            expect(isSalesforceUserStoryLabel(label)).toBe(false);
        });
    });
    it('should return false when a Salesforce bug label is passed', () => {
        ghLabels.bugLabels.forEach(label => {
            expect(isSalesforceUserStoryLabel(label)).toBe(false);
        });
    });
});
