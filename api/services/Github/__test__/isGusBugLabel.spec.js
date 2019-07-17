const isGusBugLabel = require('../isGusBugLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels
    }
};

describe('isGusBugLabel github service', () => {
    it('should return true when a gus bug label is passed', () => {
        const labels = ['BUG P0', 'BUG P1', 'BUG P2', 'BUG P3'];
        labels.forEach(label => {
            expect(isGusBugLabel(label)).toBe(true);
        });
    });
    it('should return false when not a gus bug label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'GUS'];
        labels.forEach(label => {
            expect(isGusBugLabel(label)).toBe(false);
        });
    });
    it('should return false when a USER STORY label is passed', () => {
        expect(isGusBugLabel(ghLabels.storyLabel)).toBe(false);
    });
});
