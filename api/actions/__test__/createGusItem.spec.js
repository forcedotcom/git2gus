const { fn } = require('../createGusItem');
const Builds = require('../../services/Builds');
const Github =  require('../../services/Github');

jest.mock('../../services/Builds', () => ({
    resolveBuild: jest.fn(),
}));
jest.mock('../../services/Github', () => ({
    isGusLabel: jest.fn(),
    getPriority: () => 'P1',
}));

global.sails = {
    hooks: {
        'issues-hook': {
            queue: {
                push: jest.fn(),
            },
        },
    },
};

let req = {
    body: {
        issue: {
            url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: 'some description',
            number: 30,
        },
        label: 'GUS P1',
        repository: {
            name: 'git2gus-test',
            owner: {
                login: 'john',
            },
        },
    },
    git2gus: {
        config: {
            productTag: 'abcd1234',
            defaultBuild: '218',
        },
    },
    octokitClient: {
        issues: {
            createComment: jest.fn(),
        },
    },
};

describe('createGusItem action', () => {
    it('should call queue push with the right values', async () => {
        expect.assertions(1);
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'CREATE_GUS_ITEM',
            subject: 'new issue',
            description: 'some description',
            productTag: 'abcd1234',
            status: 'NEW',
            foundInBuild: 'qwerty1234',
            priority: 'P1',
            relatedUrl: 'github/git2gus-test/#30',
        });
    });
    it('should create a github comment when there is not a valid build and milestone', async () => {
        expect.assertions(2);
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve(null));
        await fn(req);
        expect(req.octokitClient.issues.createComment).toHaveBeenCalledWith({
            owner: 'john',
            repo: 'git2gus-test',
            number: 30,
            body: 'The defaultBuild value 218 in `.git2gus/config.json` doesn\'t match any valid build in GUS.',
        });
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should create a github comment when there is not a valid build but there is a milestone', async () => {
        expect.assertions(2);
        req.octokitClient.issues.createComment.mockReset();
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve(null));
        req.body.issue.milestone = {
            title: 220,
        };
        await fn(req);
        expect(req.octokitClient.issues.createComment).toHaveBeenCalledWith({
            owner: 'john',
            repo: 'git2gus-test',
            number: 30,
            body: 'The milestone assigned to the issue doesn\'t match any valid build in GUS.',
        });
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call anything when the label is not a gus label', async () => {
        expect.assertions(2);
        req.octokitClient.issues.createComment.mockReset();
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isGusLabel.mockReturnValue(false);
        await fn(req);
        expect(req.octokitClient.issues.createComment).not.toHaveBeenCalled();
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
});
