/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { fn } = require('../createWorkItem');
const Builds = require('../../services/Builds');
const Github = require('../../services/Github');
const { getWorkItemUrl, waitUntilSynced } = require('./../../services/Issues');

jest.mock('../../services/Builds', () => ({
    resolveBuild: jest.fn()
}));
jest.mock('../../services/Github', () => ({
    isSalesforceLabel: jest.fn(),
    getPriority: () => 'P1',
    getRecordTypeId: () => 'bug',
    createComment: jest.fn(),
    updateDescription: jest.fn()
}));
jest.mock('../../services/Issues', () => ({
    getWorkItemUrl: jest.fn(),
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
            html_url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: '### some title\nsome description',
            number: 30,
            labels: [{ name: 'BUG P1' }]
        },
        label: 'BUG P1',
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
            html_url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: 'some description',
            number: 30,
            labels: [{ name: 'BUG P1' }, { name: 'testTagLabel' }]
        },
        label: 'BUG P1',
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
            html_url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: 'some description',
            number: 30,
            labels: [{ name: 'BUG P1' }, { name: 'notAProductTagLabel' }]
        },
        label: 'BUG P1',
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

const reqWithIssueTypeLabels = {
    body: {
        issue: {
            html_url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: 'some description',
            number: 30,
            labels: [{ name: 'feature' }, { name: 'notAValidLabel' }]
        },
        label: 'feature',
        repository: {
            name: 'git2gus-test',
            owner: {
                login: 'john'
            }
        }
    },
    git2gus: {
        config: {
            issueTypeLabels: {
                feature: 'BUG P1'
            },
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

const reqWithGusTitlePrefix = {
    body: {
        issue: {
            html_url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: 'some description',
            number: 30,
            labels: [{ name: 'BUG P1' }]
        },
        label: 'BUG P1',
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
            defaultBuild: '218',
            gusTitlePrefix: '[Some Prefix Text]'
        }
    },
    octokitClient: {
        issues: {
            createComment: jest.fn()
        }
    }
};

describe('createGusItem action', () => {
    it('should call queue push with formatted text', async () => {
        expect.assertions(1);
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'CREATE_WORK_ITEM',
                subject: 'new issue',
                description:
                    'Github issue link: github/git2gus-test/#30\n<h3>some title</h3>\n<p>some description</p>\n',
                storyDetails:
                    'Github issue link: github/git2gus-test/#30\n<h3>some title</h3>\n<p>some description</p>\n',
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
    it('should call queue push with the right title prefix text', async () => {
        expect.assertions(1);
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(reqWithGusTitlePrefix);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'CREATE_WORK_ITEM',
                subject: '[Some Prefix Text]'.concat(' new issue'),
                description:
                    'Github issue link: github/git2gus-test/#30\n<p>some description</p>\n',
                storyDetails:
                    'Github issue link: github/git2gus-test/#30\n<p>some description</p>\n',
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
    it('should call queue push with the right issue type from label', async () => {
        expect.assertions(1);
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(reqWithIssueTypeLabels);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'CREATE_WORK_ITEM',
                subject: 'new issue',
                description:
                    'Github issue link: github/git2gus-test/#30\n<p>some description</p>\n',
                storyDetails:
                    'Github issue link: github/git2gus-test/#30\n<p>some description</p>\n',
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
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(reqWithProductTagLabel);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith(
            {
                name: 'CREATE_WORK_ITEM',
                subject: 'new issue',
                description:
                    'Github issue link: github/git2gus-test/#30\n<p>some description</p>\n',
                storyDetails:
                    'Github issue link: github/git2gus-test/#30\n<p>some description</p>\n',
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
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        await fn(reqWithOnlyProductTagLabels);
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should create a github comment when there is not a valid build and milestone', async () => {
        expect.assertions(2);
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isSalesforceLabel.mockReturnValue(true);
        Github.createComment.mockReset();
        Builds.resolveBuild.mockReturnValue(Promise.resolve(null));
        await fn(req);
        expect(Github.createComment).toHaveBeenCalledWith({
            req,
            body:
                "The defaultBuild value 218 in `.git2gus/config.json` doesn't match any valid build in Salesforce."
        });
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should create a github comment when there is not a valid build but there is a milestone', async () => {
        expect.assertions(2);
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isSalesforceLabel.mockReturnValue(true);
        Github.createComment.mockReset();
        Builds.resolveBuild.mockReturnValue(Promise.resolve(null));
        req.body.issue.milestone = {
            title: 220
        };
        await fn(req);
        expect(Github.createComment).toHaveBeenCalledWith({
            req,
            body:
                "The milestone assigned to the issue doesn't match any valid build in Salesforce."
        });
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should not call anything when the label is not a Salesforce label', async () => {
        expect.assertions(2);
        Github.createComment.mockReset();
        sails.hooks['issues-hook'].queue.push.mockReset();
        Github.isSalesforceLabel.mockReturnValue(false);
        await fn(req);
        expect(Github.createComment).not.toHaveBeenCalled();
        expect(sails.hooks['issues-hook'].queue.push).not.toHaveBeenCalled();
    });
    it('should create a comment when the "done" callback return the new work item and it is synced', async () => {
        expect.assertions(3);
        Github.createComment.mockReset();
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(
            Promise.resolve({ sfid: 'B12345' })
        );
        getWorkItemUrl.mockReset();
        waitUntilSynced.mockReturnValue(Promise.resolve({ sfci: 'SF123456' }));
        getWorkItemUrl.mockReturnValue('https://12345.com');
        sails.hooks['issues-hook'].queue.push = async (data, done) => {
            done(null, { id: '12345' });
        };
        await fn(req);
        expect(waitUntilSynced).toHaveBeenCalledWith(
            { id: '12345' },
            { interval: 60000, times: 5 }
        );
        expect(getWorkItemUrl).toHaveBeenCalledWith(
            { sfci: 'SF123456' },
            undefined
        );
        expect(Github.createComment).toHaveBeenCalledWith({
            req,
            body: `This issue has been linked to a new work item: https://12345.com`
        });
    });

    it('should create a comment without the url when the git2gus.config.hideWorkItemUrl = true', async () => {
        expect.assertions(2);
        Github.createComment.mockReset();
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(
            Promise.resolve({ sfid: 'B12345' })
        );
        getWorkItemUrl.mockReset();
        waitUntilSynced.mockReturnValue(Promise.resolve({ sfci: 'SF123456' }));
        getWorkItemUrl.mockReturnValue('https://12345.com');
        sails.hooks['issues-hook'].queue.push = async (data, done) => {
            done(null, { id: '12345' });
        };

        const req1 = JSON.parse(JSON.stringify(req));
        req1.git2gus.config.hideWorkItemUrl = true;

        await fn(req1);

        expect(waitUntilSynced).toHaveBeenCalledWith(
            { id: '12345' },
            { interval: 60000, times: 5 }
        );
        expect(getWorkItemUrl).toHaveBeenCalledWith({ sfci: 'SF123456' }, true);
    });

    it('should create a comment when the "done" callback return the new work item but it not get synced', async () => {
        expect.assertions(3);
        Github.createComment.mockReset();
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(
            Promise.resolve({ sfid: 'B12345' })
        );
        getWorkItemUrl.mockReset();
        waitUntilSynced.mockReturnValue(Promise.resolve(undefined));
        await fn(req);
        expect(waitUntilSynced).toHaveBeenCalledWith(
            { id: '12345' },
            { interval: 60000, times: 5 }
        );
        expect(getWorkItemUrl).not.toHaveBeenCalled();
        expect(Github.createComment).toHaveBeenCalledWith({
            req,
            body:
                'Sorry we could not wait until Heroku connect make the synchronization.'
        });
    });
});
