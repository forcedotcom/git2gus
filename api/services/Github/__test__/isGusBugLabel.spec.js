const isGusBugLabel = require('../isGusBugLabel');
const { gus } = require('../../../../config/gus');

global.sails = {
    config: {
        gus
    }
};

describe('isGusBugLabel github service', () => {
    it('should return true when a gus bug label is passed', () => {
        const labels = ['GUS P0', 'GUS P1', 'GUS P2', 'GUS P3'];
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
    it('should return false when a gus story label is passed', () => {
        expect(isGusBugLabel(gus.storyLabel)).toBe(false);
    });
});
