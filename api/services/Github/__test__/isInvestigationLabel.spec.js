const isInvestigationLabel = require('../isInvestigationLabel');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels
    }
};

describe('isInvestigationLabel github service', () => {
    it('should return true when a gus investigation label is passed', () => {
        const labels = [
            'INVESTIGATION P0',
            'INVESTIGATION P1',
            'INVESTIGATION P2',
            'INVESTIGATION P3'
        ];
        labels.forEach(label => {
            expect(isInvestigationLabel(label)).toBe(true);
        });
    });
    it('should return false when not a gus label is passed', () => {
        const labels = ['security', 'P1', 'bug', 'GUS'];
        labels.forEach(label => {
            expect(isInvestigationLabel(label)).toBe(false);
        });
    });
    it('should return false when a gus bug label is passed', () => {
        ghLabels.bugLabels.forEach(label => {
            expect(isInvestigationLabel(label)).toBe(false);
        });
    });
    it('should return false when a gus story label is passed', () => {
        expect(isInvestigationLabel(ghLabels.userStoryLabel)).toBe(false);
    });
});
