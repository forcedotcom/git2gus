const isGusInvestigationLabel = require('../isGusInvestigationLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels
    }
};

describe('isGusInvestigationLabel github service', () => {
    it('should return true when a gus investigation label is passed', () => {
        const labels = [
            'GUS INVESTIGATION P0',
            'GUS INVESTIGATION P1',
            'GUS INVESTIGATION P2',
            'GUS INVESTIGATION P3'
        ];
        labels.forEach(label => {
            expect(isGusInvestigationLabel(label)).toBe(true);
        });
    });
    it('should return false when not a gus label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'GUS'];
        labels.forEach(label => {
            expect(isGusInvestigationLabel(label)).toBe(false);
        });
    });
    it('should return false when a gus bug label is passed', () => {
        ghLabels.bugLabels.forEach(label => {
            expect(isGusInvestigationLabel(label)).toBe(false);
        });
    });
    it('should return false when a gus story label is passed', () => {
        expect(isGusInvestigationLabel(ghLabels.storyLabel)).toBe(false);
    });
});
