const isGusLabel = require('../isSalesforceLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels: ghLabels
    }
};

describe('isGusLabel github service', () => {
    it('should return true when a gus label is passed', () => {
        const labels = ['BUG P0', 'BUG P1', 'BUG P2', 'BUG P3', 'USER STORY'];
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
