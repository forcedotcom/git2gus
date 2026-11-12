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
    getById: jest.fn(),
    field: name => name + '__c'
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
            number: 30
        },
        label: {
            name: 'BUG P1'
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
            defaultBuild: '218',
            issueEpicMapping: {
                'BUG P1': 'a123456'
            }
        }
    },
    octokitClient: {
        issues: {
            createComment: jest.fn()
        }
    }
};

const reqWithoutIssueEpicMapping = {
    body: {
        issue: {
            html_url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: '### some title\nsome description',
            number: 30
        },
        label: {
            name: 'BUG P1'
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
            labels: [{ name: 'testTagLabel' }]
        },
        label: {
            name: 'BUG P1'
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
            productTagLabels: {
                testTagLabel: 'efgh5678',
                testTagLabel2: 'zyxw9876'
            },
            defaultBuild: '218',
            issueEpicMapping: {
                'BUG P1': 'a123456'
            }
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
            labels: [{ name: 'notAProductTagLabel' }]
        },
        label: {
            name: 'BUG P1'
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
            productTagLabels: {
                testTagLabel: 'efgh5678',
                testTagLabel2: 'zyxw9876'
            },
            defaultBuild: '218',
            issueEpicMapping: {
                'BUG P1': 'a123456'
            }
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
            labels: [{ name: 'notAValidLabel' }]
        },
        label: {
            name: 'feature'
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
            issueTypeLabels: {
                feature: 'BUG P1'
            },
            productTag: 'abcd1234',
            defaultBuild: '218',
            issueEpicMapping: {
                'BUG P1': 'a123456'
            }
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
            labels: [{ name: 'notAValidLabel' }]
        },
        label: {
            name: 'feature'
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
            issueTypeLabels: {
                feature: 'USER STORY'
            },
            productTag: 'abcd1234',
            defaultBuild: '218',
            issueEpicMapping: {
                'BUG P1': 'a123456'
            }
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
            number: 30
        },
        label: {
            name: 'BUG P1'
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
            defaultBuild: '218',
            gusTitlePrefix: '[Some Prefix Text]',
            issueEpicMapping: {
                'BUG P1': 'a123456'
            }
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
            'bug',
            'a123456'
        );
    });
    it('should call createWorkItemInGus without epic Id', async () => {
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
        await fn(reqWithoutIssueEpicMapping);
        expect(Gus.createWorkItemInGus).toHaveBeenCalledWith(
            'new issue',
            'Body In Gus format',
            'abcd1234',
            'NEW',
            '229',
            'P1',
            'github/git2gus-test/#30',
            'bug',
            null
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
            'bug',
            'a123456'
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
            'bug',
            'a123456'
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
            'bug',
            'a123456'
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
            'bug',
            'a123456'
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

    describe('title truncation (255 char GUS limit)', () => {
        const setupMocks = () => {
            Github.getRecordTypeId.mockReturnValue('bug');
            Github.isSalesforceLabel.mockReturnValue(true);
            Builds.resolveBuild.mockReturnValue(Promise.resolve('qwerty1234'));
            // echo the body so we can assert on the description sent to Gus
            formatToGus.formatToGus.mockImplementation((url, body) =>
                Promise.resolve(body)
            );
            Gus.resolveBuild.mockReturnValue(Promise.resolve('229'));
            Gus.getByRelatedUrl.mockReturnValue(Promise.resolve(''));
            Gus.getBugRecordTypeId.mockReturnValue(Promise.resolve('bug'));
        };
        const buildReq = (title, body, extraConfig = {}) => {
            const r = JSON.parse(JSON.stringify(req));
            r.body.issue.title = title;
            r.body.issue.body = body;
            Object.assign(r.git2gus.config, extraConfig);
            return r;
        };

        it('should truncate title over 255 chars and append overflow to description', async () => {
            expect.assertions(4);
            setupMocks();
            const title = 'a'.repeat(200) + 'b'.repeat(100); // 300 chars
            await fn(buildReq(title, 'original body'));
            const [
                subject,
                description
            ] = Gus.createWorkItemInGus.mock.calls[0];
            expect(subject).toBe(title.substring(0, 252) + '...');
            expect(subject).toHaveLength(255);
            expect(description).toContain('...' + title.substring(252));
            expect(description).toContain('original body');
        });

        it('should not change title or body when title is exactly 255 chars', async () => {
            expect.assertions(3);
            setupMocks();
            const title = 'a'.repeat(255);
            await fn(buildReq(title, 'original body'));
            const [
                subject,
                description
            ] = Gus.createWorkItemInGus.mock.calls[0];
            expect(subject).toBe(title);
            expect(description).toBe('original body');
            expect(formatToGus.formatToGus).toHaveBeenCalledWith(
                'github/git2gus-test/#30',
                'original body'
            );
        });

        it('should truncate prefix + title when gusTitlePrefix is set', async () => {
            expect.assertions(3);
            setupMocks();
            const prefix = '[Some Prefix Text]';
            const title = 'x'.repeat(260);
            const prefixed = prefix + ' ' + title;
            await fn(
                buildReq(title, 'original body', { gusTitlePrefix: prefix })
            );
            const [
                subject,
                description
            ] = Gus.createWorkItemInGus.mock.calls[0];
            expect(subject).toBe(prefixed.substring(0, 252) + '...');
            expect(subject).toHaveLength(255);
            expect(description).toContain('...' + prefixed.substring(252));
        });

        it('should not throw and should keep overflow in description when body is null', async () => {
            expect.assertions(4);
            setupMocks();
            const title = 'a'.repeat(250) + 'OVERFLOW_TEXT';
            await expect(fn(buildReq(title, null))).resolves.not.toThrow();
            const [
                subject,
                description
            ] = Gus.createWorkItemInGus.mock.calls[0];
            expect(subject).toBe(title.substring(0, 252) + '...');
            expect(description).toContain('...' + title.substring(252));
            expect(description).not.toContain('null');
        });
    });
});
