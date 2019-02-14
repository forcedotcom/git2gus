const { fn } = require('../linkToGusItem');

global.sails = {
    hooks: {
        'issues-hook': {
            queue: {
                push: jest.fn(),
            },
        },
    },
};

describe('linkToGusItem action', () => {
    it('should call queue push with the right values when the issue is opened and the description matches the annotation', () => {
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-gus-app/#32',
                    body: '@w-12345@ issue description',
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'LINK_TO_GUS_ITEM',
            relatedUrl: 'github/test-gus-app/#32',
            gusItemName: 'w-12345',
        });
    });
    it('should call queue push with the right values when the issue description is edited and matches the annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                action: 'edited',
                issue: {
                    url: 'github/test-gus-app/#33',
                    body: '@w-12345@ description',
                },
                changes: {
                    body: '@w-12345@ description',
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'LINK_TO_GUS_ITEM',
            relatedUrl: 'github/test-gus-app/#33',
            gusItemName: 'w-12345',
        });
    });
    it('should not call queue push when the description does not match the annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-gus-app/#32',
                    body: 'issue description',
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call queue push when the issue does not have description', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-gus-app/#32',
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call queue push when the issue is edited but not the description', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                action: 'edited',
                issue: {
                    url: 'github/test-gus-app/#32',
                    body: 'issue description',
                },
                changes: {
                    title: 'new title',
                },
            },
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
});
