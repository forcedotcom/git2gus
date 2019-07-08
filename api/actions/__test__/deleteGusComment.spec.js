const { fn } = require('../deleteGusComment');
const Builds = require('../../services/Builds');
const Github = require('../../services/Github');
const { ghLabels } = require('../../../config/ghLabels');

jest.mock('../../services/Builds', () => ({
    resolveBuild: jest.fn()
}));
jest.mock('../../services/Github', () => ({
    isGusLabel: jest.fn(),
    getPriority: () => 'P1',
    getRecordTypeId: () => 'bug',
    createComment: jest.fn()
}));
jest.mock('../../services/Issues', () => ({
    getGusItemUrl: jest.fn(),
    waitUntilSynced: jest.fn()
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

const req = {
    body: {
        issue: {
            labels: [
                { name: ghLabels.bugLabels[0] },
                { name: ghLabels.commentSyncLabel }
            ],
            milestone: '218'
        },
        comment: {
            issue_url: 'github.com/git2gus-test/#30',
            url: 'github.com/git2gus-test/526193',
            body: 'test comment'
        },
        repository: {
            name: 'git2gus-test',
            owner: {
                login: 'john'
            }
        }
    },
    git2gus: {
        config: {
            productTag: 'abcd1234',
            defaultBuild: '218'
        }
    }
};

const reqNoSyncLabel = {
    body: {
        issue: {
            labels: [{ name: ghLabels.bugLabels[0] }],
            milestone: '218'
        },
        comment: {
            issue_url: 'github.com/git2gus-test/#30',
            url: 'github.com/git2gus-test/526193',
            body: 'test comment'
        },
        repository: {
            name: 'git2gus-test',
            owner: {
                login: 'john'
            }
        }
    },
    git2gus: {
        config: {
            productTag: 'abcd1234',
            defaultBuild: '218'
        }
    }
};

describe('createOrUpdateGusComment action', () => {
    it('should not call queue push with no sync label', async () => {
        expect.assertions(1);
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(reqNoSyncLabel);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should call queue push with the right values', async () => {
        expect.assertions(1);
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'DELETE_GUS_ITEM_COMMENT',
                relatedUrl: 'github.com/git2gus-test/#30',
                comment: {
                    url: 'github.com/git2gus-test/526193',
                    body: 'test comment'
                }
            },
            expect.any(Function)
        );
    });
    it('should not call anything when the label is not a gus label', async () => {
        expect.assertions(1);
        Github.createComment.mockReset();
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isGusLabel.mockReturnValue(false);
        await fn(req);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
});
