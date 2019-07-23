const getRecordTypeId = require('../getRecordTypeId');
const { salesforce } = require('../../../../config/salesforce');
const { ghLabels } = require('../../../../config/ghLabels');
const Github = require('../index');

jest.mock('..', () => ({
    isSalesfoceUserStoryLabel: jest.fn(),
    isSalesforceBugLabel: jest.fn()
}));

global.sails = {
    config: {
        salesforce,
        ghLabels
    }
};

describe('getRecordTypeId github service', () => {
    it('should return story recordTypeId when story label present', () => {
        Github.isSalesfoceUserStoryLabel.mockReturnValue(true);
        Github.isSalesforceBugLabel.mockReturnValue(true);
        const labels = [
            { name: 'BUG P2' },
            { name: 'bug' },
            { name: 'USER STORY' },
            { name: 'BUG P1' }
        ];
        expect(getRecordTypeId(labels)).toBe(salesforce.userStoryRecordTypeId);
    });
    it('should return bug recordTypeId when bug label but no story label present', () => {
        Github.isSalesfoceUserStoryLabel.mockReturnValue(false);
        Github.isSalesforceBugLabel.mockReturnValue(true);
        const labels = [
            { name: 'BUG P2' },
            { name: 'bug' },
            { name: 'BUG P1' }
        ];
        expect(getRecordTypeId(labels)).toBe(salesforce.bugRecordTypeId);
    });
    it('should return undefined when an empty array is passed', () => {
        expect(getRecordTypeId([])).toBeUndefined();
    });
    it('should return undefined when an array with not Salesforce labels is passed', () => {
        const labels = [
            { name: 'chore' },
            { name: 'bug' },
            { name: 'refactor' }
        ];
        Github.isSalesfoceUserStoryLabel.mockReturnValue(false);
        Github.isSalesforceBugLabel.mockReturnValue(false);
        expect(getRecordTypeId(labels)).toBeUndefined();
    });
});
