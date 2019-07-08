const isGusLabel = require('../isGusLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels: ghLabels
    }
};

describe('isGusLabel github service', () => {
    it('should return true when a gus label is passed', () => {
        const labels = ['GUS P0', 'GUS P1', 'GUS P2', 'GUS P3', 'GUS STORY'];
        labels.forEach(label => {
            expect(isGusLabel(label)).toBe(true);
        });
    });
    it('should return false when not a gus label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'GUS'];
        labels.forEach(label => {
            expect(isGusLabel(label)).toBe(false);
        });
    });
});
