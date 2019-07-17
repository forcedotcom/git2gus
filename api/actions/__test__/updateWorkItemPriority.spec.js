const { fn } = require('../updateWorkItemPriority');
const Github = require('../../services/Github');

jest.mock('../../services/Github', () => ({
    isGusBugLabel: jest.fn(),
    getPriority: jest.fn()
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

describe('updateGusItemPriority action', () => {
    it('should call queue push with the right values', () => {
        Github.isGusBugLabel.mockReturnValue(true);
        Github.getPriority.mockReturnValue('P0');
        const req = {
            body: {
                issue: {
                    url: 'github/test-git2gus/#110'
                },
                label: {
                    name: 'BUG P0'
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'UPDATE_GUS_ITEM_PRIORITY',
            priority: 'P0',
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
    it('should not call queue push when is not a gus bug label', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isGusBugLabel.mockReturnValue(false);
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