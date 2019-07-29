const { fn } = require('../updateWorkItemRecordTypeId');
const Github = require('../../services/Github');

jest.mock('../../services/Github', () => ({
    isSalesforceLabel: jest.fn(),
    getRecordTypeId: jest.fn()
}));

global.sails = {
    hooks: {
        'issues-hook': {
            queue: {
                push: jest.fn()
            }
        }
    }
};

describe('updateGusItemRecordTypeId action', () => {
    it('should call queue push with the right values', () => {
        Github.isSalesforceLabel.mockReturnValue(true);
        Github.getRecordTypeId.mockReturnValue('story123');
        const req = {
            body: {
                issue: {
                    url: 'github/test-git2gus/#110'
                },
                label: {
                    name: 'USER STORY'
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'UPDATE_WORK_ITEM_RECORDTYPEID',
            recordTypeId: 'story123',
            relatedUrl: 'github/test-git2gus/#110'
        });
    });
    it('should not call queue push when there is not label', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                issue: {
                    url: 'github/test-git2gus/#112'
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call queue push when is not a gus label', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isSalesforceLabel.mockReturnValue(false);
        const req = {
            body: {
                issue: {
                    url: 'github/test-git2gus/#111'
                },
                label: {
                    name: 'chore'
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
});
