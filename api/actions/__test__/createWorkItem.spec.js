/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { fn } = require('../createWorkItem');
const Builds = require('../../services/Builds');
const formatToGus = require('../../actions/formatToGus');
const Github = require('../../services/Github');
const Gus = require('../../services/Gus');

jest.mock('../../services/Builds', () => ({
    resolveBuild: jest.fn()
}));
jest.mock('../../services/Github', () => ({
    isSalesforceLabel: jest.fn(),
    getPriority: () => 'P1',
    getRecordTypeId: jest.fn(),
    createComment: jest.fn(),
    updateDescription: jest.fn()
}));
jest.mock('../../services/Issues', () => ({
    getWorkItemUrl: jest.fn(),
    waitUntilSynced: jest.fn()
}));
jest.mock('../../services/Gus', () => ({
    getByRelatedUrl: jest.fn(),
    createWorkItemInGus: jest.fn(),
    resolveBuild: jest.fn(),
    getBugRecordTypeId: jest.fn(),
    getById: jest.fn()
}));
jest.mock('../../actions/formatToGus', () => ({
    formatToGus: jest.fn()
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

afterEach(() => {
    jest.clearAllMocks();
});

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

const reqWithIssueTypeUserStory = {
    body: {
        issue: {
            html_url: 'github/git2gus-test/#30',
            title: 'new feature request',
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
                feature: 'USER STORY'
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
    it('should call createWorkItemInGus with formatted text', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        await fn(req);
        expect(Gus.createWorkItemInGus).toHaveBeenCalledWith(
            'new issue',
            'Body In Gus format',
            'abcd1234',
            'NEW',
            '229',
            'P1',
            'github/git2gus-test/#30',
            'bug'
        );
    });
    it('should call createWorkItemInGus with the right title prefix text', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        await fn(reqWithGusTitlePrefix);
        expect(Gus.createWorkItemInGus).toHaveBeenCalledWith(
            '[Some Prefix Text]'.concat(' new issue'),
            'Body In Gus format',
            'abcd1234',
            'NEW',
            '229',
            'P1',
            'github/git2gus-test/#30',
            'bug'
        );
    });
    it('should call createWorkItemInGus with the right issue type from label', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        await fn(reqWithIssueTypeLabels);
        expect(Gus.createWorkItemInGus).toHaveBeenCalledWith(
            'new issue',
            'Body In Gus format',
            'abcd1234',
            'NEW',
            '229',
            'P1',
            'github/git2gus-test/#30',
            'bug'
        );
    });
    it('should call createWorkItemInGus with the right issue type from label', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        await fn(reqWithIssueTypeLabels);
        expect(Gus.createWorkItemInGus).toHaveBeenCalledWith(
            'new issue',
            'Body In Gus format',
            'abcd1234',
            'NEW',
            '229',
            'P1',
            'github/git2gus-test/#30',
            'bug'
        );
    });
    it('should call createWorkItemInGus with the right product tag label', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        await fn(reqWithProductTagLabel);
        expect(Gus.createWorkItemInGus).toHaveBeenCalledWith(
            'new issue',
            'Body In Gus format',
            'efgh5678',
            'NEW',
            '229',
            'P1',
            'github/git2gus-test/#30',
            'bug'
        );
    });
    it('should not call createWorkItemInGus if user story already exists in GUS', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('story');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        var dummyIssue = { RecordTypeId: 'story' };
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(dummyIssue));
        await fn(req);
        expect(Gus.createWorkItemInGus).not.toHaveBeenCalled();
    });
    it('should not call createWorkItemInGus if bug already exists in GUS', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        var dummyIssue = { RecordTypeId: 'bug', Priority__c: '1' };
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(dummyIssue));
        await fn(reqWithIssueTypeUserStory);
        expect(Gus.createWorkItemInGus).not.toHaveBeenCalled();
    });
    it('should not call createWorkItemInGus if no product tag and label is not a product tag label', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('abcd1234'));
        await fn(reqWithOnlyProductTagLabels);
        expect(Gus.createWorkItemInGus).not.toHaveBeenCalled();
    });
    it('should create a github comment when there is not a valid build and milestone', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve(null));
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        Github.createComment.mockReset();
        await fn(req);
        expect(Github.createComment).toHaveBeenCalledWith({
            body:
                'Error while creating work item. No valid build found in GUS!',
            req
        });
    });
    it('should create a comment when the "done" callback return the new work item and it is synced', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        const workItem = { id: '12345', Name: 'new-work-item' };
        Gus.createWorkItemInGus.mockReturnValue(workItem);
        Gus.getById.mockReturnValue(workItem);
        await fn(req);
        expect(Github.createComment).toHaveBeenCalledWith({
            req,
            body: `This issue has been linked to a new work item: [new-work-item](undefined12345/view)`
        });
    });

    it('should create a comment without the url when the git2gus.config.hideWorkItemUrl = true', async () => {
        expect.assertions(1);
        Github.getRecordTypeId.mockReturnValue('bug');
        Github.isSalesforceLabel.mockReturnValue(true);
        Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
        formatToGus.formatToGus.mockReturnValue(
            Promise.resolve('Body In Gus format')
        );
        Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
        Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
        Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        const workItem = { id: '12345', Name: 'new-work-item' };
        Gus.createWorkItemInGus.mockReturnValue(workItem);
        Gus.getById.mockReturnValue(workItem);
        const req1 = JSON.parse(JSON.stringify(req));
        req1.git2gus.config.hideWorkItemUrl = 'true';
        await fn(req1);
        expect(Github.createComment).toHaveBeenCalledWith({
            req: req1,
            body: `This issue has been linked to a new work item: new-work-item`
        });
    });
});
