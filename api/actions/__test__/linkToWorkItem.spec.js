/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { fn } = require('../linkToWorkItem');
const { createComment, addLabels } = require('../../services/Github');
const getWorkItemUrl = require('../../services/Issues/getWorkItemUrl');
const { ghLabels } = require('../../../config/ghLabels');

jest.mock('../../services/Github', () => ({
    createComment: jest.fn(),
    addLabels: jest.fn()
}));
jest.mock('../../services/Issues/getWorkItemUrl', () =>
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
        salesforce: {
            salesforceUserId: 'abcd1234',
            userStoryRecordTypeId: 'testUserStoryId',
            bugRecordTypeId: 'testBugRecordId',
            investigationRecordTypeId: 'testInvestigationId'
        },
        ghLabels
    }
};

const git2gus = {
    config: {}
};

describe('linkToWorkItem action', () => {
    it('should call queue push with the right values when the issue is opened and the description matches the annotation', () => {
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-salesforce-app/#32',
                    body: '@W-12345@ issue description'
                }
            },
            git2gus
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'LINK_TO_WORK_ITEM',
                relatedUrl: 'github/test-salesforce-app/#32',
                workItemName: 'W-12345'
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
                    url: 'github/test-salesforce-app/#33',
                    body: '@W-12345@ description'
                },
                changes: {
                    body: {
                        from: '@W-123@ description'
                    }
                }
            },
            git2gus
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'LINK_TO_WORK_ITEM',
                relatedUrl: 'github/test-salesforce-app/#33',
                workItemName: 'W-12345'
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
                    url: 'github/test-salesforce-app/#32',
                    body: 'issue description'
                }
            },
            git2gus
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
                    url: 'github/test-salesforce-app/#33',
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
                    url: 'github/test-salesforce-app/#32'
                }
            },
            git2gus
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
                    url: 'github/test-salesforce-app/#32',
                    body: 'issue description'
                },
                changes: {
                    title: {
                        from: 'new title'
                    }
                }
            },
            git2gus
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should create a comment and not add label when the "done" callback is called but the item has not priority and not user story', async () => {
        expect.assertions(3);
        sails.hooks['issues-hook'].queue.push.mockReset();
        sails.hooks['issues-hook'].queue.push.mockImplementation(
            async (data, done) => {
                done(null, {
                    id: 'abcd1234'
                });
            }
        );
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-salesforce-app/#32',
                    body: '@W-12345@'
                }
            },
            git2gus
        };
        await fn(req);
        expect(getWorkItemUrl).toHaveBeenCalledWith(
            {
                id: 'abcd1234'
            },
            undefined
        );
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
                    recordTypeId: sails.config.salesforce.userStoryRecordTypeId
                });
            }
        );
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-salesforce-app/#32',
                    body: '@W-12345@'
                }
            },
            git2gus
        };
        await fn(req);
        expect(createComment).toHaveBeenCalledTimes(1);
        expect(addLabels).toHaveBeenCalledWith({
            req,
            labels: [sails.config.ghLabels.userStoryLabel]
        });
    });
    it('should story add label when the "done" callback is called and item is investigation', async () => {
        expect.assertions(2);
        createComment.mockReset();
        sails.hooks['issues-hook'].queue.push.mockReset();
        sails.hooks['issues-hook'].queue.push.mockImplementation(
            async (data, done) => {
                done(null, {
                    id: 'abcd1234',
                    priority: 'P3',
                    recordTypeId:
                        sails.config.salesforce.investigationRecordTypeId
                });
            }
        );
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-salesforce-app/#32',
                    body: '@W-12345@'
                }
            },
            git2gus
        };
        await fn(req);
        expect(createComment).toHaveBeenCalledTimes(1);
        expect(addLabels).toHaveBeenCalledWith({
            req,
            labels: [ghLabels.investigationLabels[3]]
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
                    recordTypeId: sails.config.salesforce.bugRecordTypeId,
                    priority: 'P3'
                });
            }
        );
        const req = {
            body: {
                action: 'opened',
                issue: {
                    url: 'github/test-salesforce-app/#32',
                    body: '@W-12345@'
                }
            },
            git2gus
        };
        await fn(req);
        expect(createComment).toHaveBeenCalledTimes(1);
        expect(addLabels).toHaveBeenCalledWith({
            req,
            labels: ['BUG P3']
        });
    });
});
