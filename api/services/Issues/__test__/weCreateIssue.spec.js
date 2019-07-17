const weCreateIssue = require('../weCreateIssue');

global.sails = {
    config: {
        gus: {
            gusUserId: 'abcd1234'
        }
    }
};

describe('weCreateIssue issues service', () => {
    it('should return true when createdById match with the Salesforce user id', () => {
        const issue = {
            createdById: 'abcd1234'
        };
        expect(weCreateIssue(issue)).toBe(true);
    });
    it('should return false when createdById does not match with the Salesforce user id', () => {
        const issue = {
            createdById: 'qwerty1234'
        };
        expect(weCreateIssue(issue)).toBe(false);
    });
});
