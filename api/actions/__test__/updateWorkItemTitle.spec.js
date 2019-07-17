const { fn } = require('../updateWorkItemTitle');

global.sails = {
    hooks: {
        'issues-hook': {
            queue: {
                push: jest.fn()
            }
        }
    }
};

describe('updateWorkItemTitle action', () => {
    it('should call queue push with the right values when title is edited', () => {
        const req = {
            body: {
                issue: {
                    title: 'new title',
                    url: 'github/git2gus-app/#55'
                },
                changes: {
                    title: 'new title'
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'UPDATE_WORK_ITEM_TITLE',
            subject: 'new title',
            relatedUrl: 'github/git2gus-app/#55'
        });
    });
    it('should not call queue push when title is not edited', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                issue: {
                    title: 'issue title',
                    url: 'github/test-git2gus-app/#11'
                },
                changes: {
                    body: 'new description'
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
});
