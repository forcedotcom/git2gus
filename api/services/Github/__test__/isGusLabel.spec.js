const isGusLabel = require('../isGusLabel');
const { gus } = require('../../../../config/gus');

global.sails = {
    config: {
        gus
    }
};

describe('isGusLabel github service', () => {
    it('should return true when a gus label is passed', () => {
        const labels = [
            'GUS P0',
            'GUS P1',
            'GUS P2',
            'GUS P3',
            'GUS INVESTIGATION P0',
            'GUS INVESTIGATION P1',
            'GUS INVESTIGATION P2',
            'GUS INVESTIGATION P3',
            'GUS STORY'
        ];
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
