const { fn } = require('../createGusItem');
const Builds = require('../../services/Builds');
const Github = require('../../services/Github');
const { getGusItemUrl, waitUntilSynced } = require('./../../services/Issues');

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
            url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: 'some description',
            number: 30
        },
        label: 'GUS P1',
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
    },
    octokitClient: {
        issues: {
            createComment: jest.fn()
        }
    }
};

const reqWithProductTagLabel = {
    body: {
        issue: {
            url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: 'some description',
            number: 30,
            labels: ['GUS P1', 'testTagLabel']
        },
        label: 'GUS P1',
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
            productTagLabels: {
                testTagLabel: 'efgh5678',
                testTagLabel2: 'zyxw9876'
            },
            defaultBuild: '218'
        }
    },
    octokitClient: {
        issues: {
            createComment: jest.fn()
        }
    }
};

const reqWithOnlyProductTagLabels = {
    body: {
        issue: {
            url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: 'some description',
            number: 30,
            labels: ['GUS P1', 'notAProductTagLabelefgh5678']
        },
        label: 'GUS P1',
        repository: {
            name: 'git2gus-test',
            owner: {
                login: 'john'
            }
        }
    },
    git2gus: {
        config: {
            productTagLabels: {
                testTagLabel: 'efgh5678',
                testTagLabel2: 'zyxw9876'
            },
            defaultBuild: '218'
        }
    },
    octokitClient: {
        issues: {
            createComment: jest.fn()
        }
    }
};

describe('createGusItem action', () => {
    it('should call queue push with the right values', async () => {
        expect.assertions(1);
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'CREATE_GUS_ITEM',
                subject: 'new issue',
                description: 'some description',
                storyDetails: 'some description',
                productTag: 'abcd1234',
                status: 'NEW',
                foundInBuild: 'qwerty1234',
                priority: 'P1',
                relatedUrl: 'github/git2gus-test/#30',
                recordTypeId: 'bug'
            },
            expect.any(Function)
        );
    });
    it('should call queue push with the right product tag label', async () => {
        expect.assertions(1);
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(reqWithProductTagLabel);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'CREATE_GUS_ITEM',
                subject: 'new issue',
                description: 'some description',
                storyDetails: 'some description',
                productTag: 'efgh5678',
                status: 'NEW',
                foundInBuild: 'qwerty1234',
                priority: 'P1',
                relatedUrl: 'github/git2gus-test/#30',
                recordTypeId: 'bug'
            },
            expect.any(Function)
        );
    });
    it('should not push to queue if no product tag and label is not a product tag label', async () => {
        expect.assertions(1);
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(reqWithOnlyProductTagLabels);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should create a github comment when there is not a valid build and milestone', async () => {
        expect.assertions(2);
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isGusLabel.mockReturnValue(true);
        Github.createComment.mockReset();
        Builds.resolveBuild.mockReturnValue(Promise.resolve(null));
        await fn(req);
        expect(Github.createComment).toHaveBeenCalledWith({
            req,
            body:
                "The defaultBuild value 218 in `.git2gus/config.json` doesn't match any valid build in GUS."
        });
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should create a github comment when there is not a valid build but there is a milestone', async () => {
        expect.assertions(2);
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isGusLabel.mockReturnValue(true);
        Github.createComment.mockReset();
        Builds.resolveBuild.mockReturnValue(Promise.resolve(null));
        req.body.issue.milestone = {
            title: 220
        };
        await fn(req);
        expect(Github.createComment).toHaveBeenCalledWith({
            req,
            body:
                "The milestone assigned to the issue doesn't match any valid build in GUS."
        });
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call anything when the label is not a gus label', async () => {
        expect.assertions(2);
        Github.createComment.mockReset();
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isGusLabel.mockReturnValue(false);
        await fn(req);
        expect(Github.createComment).not.toHaveBeenCalled();
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should create a comment when the "done" callback return the new gusItem and it is synced', async () => {
        expect.assertions(3);
        Github.createComment.mockReset();
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(
            Promise.resolve({ sfid: 'B12345' })
        );
        getGusItemUrl.mockReset();
        waitUntilSynced.mockReturnValue(Promise.resolve({ sfci: 'SF123456' }));
        getGusItemUrl.mockReturnValue('https://12345.com');
        sails.hooks['issues-hook'].queue.push = async (data, done) => {
            done(null, { id: '12345' });
        };
        await fn(req);
        expect(waitUntilSynced).toHaveBeenCalledWith(
            { id: '12345' },
            { interval: 60000, times: 5 }
        );
        expect(getGusItemUrl).toHaveBeenCalledWith({ sfci: 'SF123456' });
        expect(Github.createComment).toHaveBeenCalledWith({
            req,
            body: `This issue has been linked to a new GUS work item: https://12345.com`
        });
    });
    it('should create a comment when the "done" callback return the new gusItem but it not get synced', async () => {
        expect.assertions(3);
        Github.createComment.mockReset();
        Github.isGusLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(
            Promise.resolve({ sfid: 'B12345' })
        );
        getGusItemUrl.mockReset();
        waitUntilSynced.mockReturnValue(Promise.resolve(undefined));
        await fn(req);
        expect(waitUntilSynced).toHaveBeenCalledWith(
            { id: '12345' },
            { interval: 60000, times: 5 }
        );
        expect(getGusItemUrl).not.toHaveBeenCalled();
        expect(Github.createComment).toHaveBeenCalledWith({
            req,
            body:
                'Sorry we could wait until Heroku connect make the syncronization.'
        });
    });
});
