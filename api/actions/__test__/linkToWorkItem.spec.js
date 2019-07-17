const { fn } = require('../linkToWorkItem');
const { createComment, addLabels } = require('../../services/Github');
const getGusItemUrl = require('../../services/Issues/getGusItemUrl');
const { ghLabels } = require('../../../config/ghLabels');

jest.mock('../../services/Github', () => ({
    createComment: jest.fn(),
    addLabels: jest.fn()
}));
jest.mock('../../services/Issues/getGusItemUrl', () =>
    jest.fn(() => 'https://abcd12345.com')
);
global.sails = {
    hooks: {
        'issues-hook': {
            queue: {
                push: jest.fn()
            }
        }
    },
    config: {
        gus: {
            gusUserId: 'abcd1234',
            userStoryRecordTypeId: '12345689abcdef'
        },
        ghLabels
    }
};

describe('linkToGusItem action', () => {
    it('should call queue push with the right values when the issue is opened and the description matches the annotation', () => {
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-gus-app/#32',
                    body: '@W-12345@ issue description'
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'LINK_TO_WORK_ITEM',
                relatedUrl: 'github/test-gus-app/#32',
                gusItemName: 'W-12345'
            },
            expect.any(Function)
        );
    });
    it('should call queue push with the right values when the issue description is edited and matches the annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                action: 'edited',
                issue: {
                    url: 'github/test-gus-app/#33',
                    body: '@W-12345@ description'
                },
                changes: {
                    body: {
                        from: '@W-123@ description'
                    }
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'LINK_TO_WORK_ITEM',
                relatedUrl: 'github/test-gus-app/#33',
                gusItemName: 'W-12345'
            },
            expect.any(Function)
        );
    });
    it('should not call queue push when the description does not match the annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-gus-app/#32',
                    body: 'issue description'
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call queue push when the issue description is edited but the previous and next description have the same annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                action: 'edited',
                issue: {
                    url: 'github/test-gus-app/#33',
                    body: '@W-12345@'
                },
                changes: {
                    body: {
                        from: '@W-12345@ description'
                    }
                }
            }
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
                    url: 'github/test-gus-app/#32'
                }
            }
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
                    body: 'issue description'
                },
                changes: {
                    title: {
                        from: 'new title'
                    }
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should create a comment and not add label when the "done" callback is called but the item has not priority and not user story', async () => {
        expect.assertions(3);
        sails.hooks['issues-hook'].queue.push.mockReset();
        sails.hooks['issues-hook'].queue.push.mockImplementation(
            async (data, done) => {
                done(null, { id: 'abcd1234' });
            }
        );
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-gus-app/#32',
                    body: '@W-12345@'
                }
            }
        };
        await fn(req);
        expect(getGusItemUrl).toHaveBeenCalledWith({ id: 'abcd1234' });
        expect(createComment).toHaveBeenCalledWith({
            req,
            body:
                'This issue has been linked to a new work item: https://abcd12345.com'
        });
        expect(addLabels).not.toHaveBeenCalled();
    });
    it('should story add label when the "done" callback is called and item is user story', async () => {
        expect.assertions(2);
        createComment.mockReset();
        sails.hooks['issues-hook'].queue.push.mockReset();
        sails.hooks['issues-hook'].queue.push.mockImplementation(
            async (data, done) => {
                done(null, {
                    id: 'abcd1234',
                    recordTypeId: sails.config.gus.userStoryRecordTypeId
                });
            }
        );
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-gus-app/#32',
                    body: '@W-12345@'
                }
            }
        };
        await fn(req);
        expect(createComment).toHaveBeenCalledTimes(1);
        expect(addLabels).toHaveBeenCalledWith({
            req,
            labels: [sails.config.ghLabels.storyLabel]
        });
    });
    it('should add label when the "done" callback is called and the item has priority', async () => {
        expect.assertions(2);
        createComment.mockReset();
        sails.hooks['issues-hook'].queue.push.mockReset();
        sails.hooks['issues-hook'].queue.push.mockImplementation(
            async (data, done) => {
                done(null, {
                    id: 'abcd1234',
                    priority: 'P3'
                });
            }
        );
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-gus-app/#32',
                    body: '@W-12345@'
                }
            }
        };
        await fn(req);
        expect(createComment).toHaveBeenCalledTimes(1);
        expect(addLabels).toHaveBeenCalledWith({
            req,
            labels: ['BUG P3']
        });
    });
});
