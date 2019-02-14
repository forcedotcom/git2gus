const { fn } = require('../updateGusItemDescription');

global.sails = {
    hooks: {
        'issues-hook': {
            queue: {
                push: jest.fn(),
            },
        },
    },
};

describe('updateGusItemDescription action', () => {
    it('should call queue push with the right values when description is edited', () => {
        const req = {
            body: {
                issue: {
                    body: 'new description',
                    url: 'github/test-git2gus-app/#10',
                },
                changes: {
                    body: 'new description'
                },
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'UPDATE_GUS_ITEM_DESCRIPTION',
            description: 'new description',
            relatedUrl: 'github/test-git2gus-app/#10',
        });
    });
    it('should not call queue push when description is not edited', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                issue: {
                    body: 'issue description',
                    url: 'github/test-git2gus-app/#11',
                },
                changes: {
                    title: 'new title'
                },
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
});
