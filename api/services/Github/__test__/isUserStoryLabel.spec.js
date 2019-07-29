const isUserStoryLabel = require('../isUserStoryLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels: ghLabels
    }
};

describe('isUserStoryLabel github service', () => {
    it('should return true when a USER STORY label is passed', () => {
        const label = 'USER STORY';
        expect(isUserStoryLabel(label)).toBe(true);
    });
    it('should return false when not a USER STORY label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'Salesforce'];
        labels.forEach(label => {
            expect(isUserStoryLabel(label)).toBe(false);
        });
    });
    it('should return false when a Salesforce bug label is passed', () => {
        ghLabels.bugLabels.forEach(label => {
            expect(isUserStoryLabel(label)).toBe(false);
        });
    });
});
