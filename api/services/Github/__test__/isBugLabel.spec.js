const isBugLabel = require('../isBugLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels
    }
};

describe('isBugLabel github service', () => {
    it('should return true when a Salesforce bug label is passed', () => {
        const labels = ['BUG P0', 'BUG P1', 'BUG P2', 'BUG P3'];
        labels.forEach(label => {
            expect(isBugLabel(label)).toBe(true);
        });
    });
    it('should return false when not a Salesforce bug label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'Salesforce'];
        labels.forEach(label => {
            expect(isBugLabel(label)).toBe(false);
        });
    });
    it('should return false when a USER STORY label is passed', () => {
        expect(isBugLabel(ghLabels.userStoryLabel)).toBe(false);
    });
});
