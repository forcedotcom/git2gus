const getMatchedComments = require('../getMatchedComments');

describe('getMatchedComments git2gus service', () => {
    it('should return the matched comments', () => {
        const comments = [
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/ABcd1234/view'
            },
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/qwerty1234/view'
            },
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/ABcd1234/view'
            },
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/abcd1234/view'
            }
        ];
        const sfid = 'ABcd1234';
        expect(getMatchedComments(comments, sfid)).toEqual([
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/ABcd1234/view'
            },
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/ABcd1234/view'
            }
        ]);
    });
    it('should return an empty array when there is not matched comments', () => {
        const comments = [
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/cd1234/view'
            },
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/qwerty1234/view'
            },
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/acd1234/view'
            },
            {
                body:
                    'This issue has been linked to a new GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/abcd1234/view'
            }
        ];
        const sfid = 'ABcd1234';
        expect(getMatchedComments(comments, sfid)).toEqual([]);
    });
    it('should return an empty array when the comments passed is an empty array', () => {
        const comments = [];
        const sfid = 'ABcd1234';
        expect(getMatchedComments(comments, sfid)).toEqual([]);
    });
    it('should return an empty array when there is not comments passed', () => {
        const sfid = 'ABcd1234';
        expect(getMatchedComments(undefined, sfid)).toEqual([]);
    });
});
