const getRecordTypeId = require('../getRecordTypeId');
const { gus } = require('../../../../config/gus');
const Github = require('../index');

jest.mock('..', () => ({
    isGusStoryLabel: jest.fn(),
    isGusBugLabel: jest.fn()
}));

global.sails = {
    config: {
        gus
    }
};

describe('getRecordTypeId github service', () => {
    it('should return investigation recordTypeId when investigation label present', () => {
        Github.isGusInvestigationLabel.mockReturnValue(true);
        Github.isGusStoryLabel.mockReturnValue(true);
        Github.isGusBugLabel.mockReturnValue(true);
        const labels = [
            { name: 'GUS P2' },
            { name: 'bug' },
            { name: 'GUS STORY' },
            { name: 'GUS P1' },
            { name: 'GUS INVESTIGATION P1' }
        ];
        expect(getRecordTypeId(labels)).toBe(gus.investigationRecordTypeId);
    });
    it('should return story recordTypeId when story label present and no investigation label present', () => {
        Github.isGusInvestigationLabel.mockReturnValue(false);
        Github.isGusStoryLabel.mockReturnValue(true);
        Github.isGusBugLabel.mockReturnValue(true);
        const labels = [
            { name: 'GUS P2' },
            { name: 'bug' },
            { name: 'GUS STORY' },
            { name: 'GUS P1' }
        ];
        expect(getRecordTypeId(labels)).toBe(gus.userStoryRecordTypeId);
    });
    it('should return bug recordTypeId when bug label but no story or investigation label present', () => {
        Github.isGusInvestigationLabel.mockReturnValue(false);
        Github.isGusStoryLabel.mockReturnValue(false);
        Github.isGusBugLabel.mockReturnValue(true);
        const labels = [
            { name: 'GUS P2' },
            { name: 'bug' },
            { name: 'GUS P1' }
        ];
        expect(getRecordTypeId(labels)).toBe(gus.bugRecordTypeId);
    });
    it('should return undefined when an empty array is passed', () => {
        expect(getRecordTypeId([])).toBeUndefined();
    });
    it('should return undefined when an array with not gus labels is passed', () => {
        const labels = [
            { name: 'chore' },
            { name: 'bug' },
            { name: 'refactor' }
        ];
        Github.isGusInvestigationLabel.mockReturnValue(false);
        Github.isGusStoryLabel.mockReturnValue(false);
        Github.isGusBugLabel.mockReturnValue(false);
        expect(getRecordTypeId(labels)).toBeUndefined();
    });
});
