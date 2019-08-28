/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { fn } = require('../unlinkWorkItem');
const { deleteLinkedComment } = require('../../services/Git2Gus');

jest.mock('../../services/Git2Gus', () => ({
    deleteLinkedComment: jest.fn()
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

describe('unlinkWorkItem action', () => {
    it('should call queue push with the right values when the previous description matches the annotation', () => {
        const req = {
            body: {
                issue: {
                    body: ''
                },
                changes: {
                    body: {
                        from: '@W-123@ issue description'
                    }
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'UNLINK_WORK_ITEM',
                workItemName: 'W-123'
            },
            expect.any(Function)
        );
    });
    it('should not call queue push when the previous description does not match the annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                issue: {
                    body: ''
                },
                changes: {
                    body: {
                        from: 'issue description'
                    }
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call queue push when the issue does not have a previous description', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                issue: {
                    body: ''
                },
                changes: {
                    title: {
                        from: 'issue title'
                    }
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call queue push when the previous and next description have the same annotation', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        const req = {
            body: {
                issue: {
                    body: '@W-123@'
                },
                changes: {
                    body: {
                        from: '@W-123@ issue description'
                    }
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should delete the linked comment when the "done" callback is called', async () => {
        expect.assertions(1);
        sails.hooks['issues-hook'].queue.push.mockReset();
        sails.hooks['issues-hook'].queue.push.mockImplementation(
            async (data, done) => {
                done(null, { sfid: 'abcd1234' });
            }
        );
        const req = {
            body: {
                issue: {
                    url: 'github/test-app/#32',
                    body: '@W-12345@'
                },
                changes: {
                    body: {
                        from: '@W-123@'
                    }
                }
            }
        };
        await fn(req);
        expect(deleteLinkedComment).toHaveBeenCalledWith({
            req,
            sfid: 'abcd1234'
        });
    });
    it('should not delete the linked comment when the "done" callback is called but there is not item', async () => {
        expect.assertions(1);
        deleteLinkedComment.mockReset();
        sails.hooks['issues-hook'].queue.push.mockReset();
        sails.hooks['issues-hook'].queue.push.mockImplementation(
            async (data, done) => {
                done(null, null);
            }
        );
        const req = {
            body: {
                issue: {
                    url: 'github/test-app/#32',
                    body: '@W-12345@'
                },
                changes: {
                    body: {
                        from: '@W-123@'
                    }
                }
            }
        };
        await fn(req);
        expect(deleteLinkedComment).not.toHaveBeenCalled();
    });
});
