const { fn } = require('../unlinkGusItem');

global.sails = {
    hooks: {
        'issues-hook': {
            queue: {
                push: jest.fn(),
            },
        },
    },
};

describe('unlinkGusItem action', () => {
    it('should call queue push with the right values when the previous description matches the annotation', () => {
        const req = {
            body: {
                changes: {
                    body: {
                        from: '@w-123@ issue description',
                    },
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'UNLINK_GUS_ITEM',
            gusItemName: 'w-123',
        });
    });
    it('should not call queue push when the previous description does not match the annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                changes: {
                    body: {
                        from: 'issue description',
                    },
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call queue push when the issue does not have a previous description', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                changes: {
                    title: {
                        from: 'issue title',
                    },
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
});
