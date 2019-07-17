const isSalesforceLabel = require('../isSalesforceLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels: ghLabels
    }
};

describe('isSalesforceLabel github service', () => {
    it('should return true when a Salesforce label is passed', () => {
        const labels = ['BUG P0', 'BUG P1', 'BUG P2', 'BUG P3', 'USER STORY'];
        labels.forEach(label => {
            expect(isSalesforceLabel(label)).toBe(true);
        });
    });
    it('should return false when not a Salesforce label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'Salesforce'];
        labels.forEach(label => {
            expect(isSalesforceLabel(label)).toBe(false);
        });
    });
});
