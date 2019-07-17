const isGusStoryLabel = require('../isSalesforceUserStoryLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels: ghLabels
    }
};

describe('isGusStoryLabel github service', () => {
    it('should return true when a USER STORY label is passed', () => {
        const label = 'USER STORY';
        expect(isGusStoryLabel(label)).toBe(true);
    });
    it('should return false when not a USER STORY label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'GUS'];
        labels.forEach(label => {
            expect(isGusStoryLabel(label)).toBe(false);
        });
    });
    it('should return false when a gus bug label is passed', () => {
        ghLabels.bugLabels.forEach(label => {
            expect(isGusStoryLabel(label)).toBe(false);
        });
    });
});
