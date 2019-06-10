const isGusStoryLabel = require('../isGusStoryLabel');
const { gus } = require('../../../../config/gus');

global.sails = {
    config: {
        gus
    }
};

describe('isGusStoryLabel github service', () => {
    it('should return true when a gus story label is passed', () => {
        const label = 'GUS STORY';
        expect(isGusStoryLabel(label)).toBe(true);
    });
    it('should return false when not a gus story label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'GUS'];
        labels.forEach(label => {
            expect(isGusStoryLabel(label)).toBe(false);
        });
    });
    it('should return false when a gus bug label is passed', () => {
        gus.bugLabels.forEach(label => {
            expect(isGusStoryLabel(label)).toBe(false);
        });
    });
});
