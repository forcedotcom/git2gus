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
                issue: {
                    body: '',
                },
                changes: {
                    body: {
                        from: '@W-123@ issue description',
                    },
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'UNLINK_GUS_ITEM',
            gusItemName: 'W-123',
        });
    });
    it('should not call queue push when the previous description does not match the annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                issue: {
                    body: '',
                },
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
                issue: {
                    body: '',
                },
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
    it('should not call queue push when the previous and next description have the same annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                issue: {
                    body: '@W-123@',
                },
                changes: {
                    body: {
                        from: '@W-123@ issue description',
                    },
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
});
