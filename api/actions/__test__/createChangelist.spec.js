/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { fn } = require('../createChangelist');
const Gus = require('../../services/Gus');

jest.mock('../../services/Gus', () => ({
    createChangelistInGus: jest.fn(),
    getWorkItemIdByName: jest.fn()
}));

jest.mock('../../services/Issues', () => ({
    getByName: jest.fn()
}));

const req = {
    body: {
        pull_request: {
            title: 'pull request title @W-1234567@',
            html_url: 'https://github.com/Codertocat/Hello-World/pull/2',
            closed_at: '2020-02-13T18:30:28Z',
            body:
                'some description\n\ndescription with workitem @W-7654321@\n\nmore description',
            merged_at: '2019-05-15T15:20:33Z'
        }
    }
};

const reqWithWorkItemInBody = {
    body: {
        pull_request: {
            title: 'pull request title without workitem id',
            html_url: 'https://github.com/Codertocat/Hello-World/pull/2',
            closed_at: '2020-02-13T18:30:28Z',
            body: 'description with workitem @W-7654321@',
            merged_at: '2019-05-15T15:20:33Z'
        }
    }
};

const reqWithoutWorkItem = {
    body: {
        pull_request: {
            title: 'pull request title',
            html_url: 'https://github.com/Codertocat/Hello-World/pull/2',
            closed_at: '2020-02-13T18:30:28Z',
        }
    }
};

const reqWithWorkItemInWrongFormat = {
    body: {
        pull_request: {
            title: 'pull request title W-1234567',
            html_url: 'https://github.com/Codertocat/Hello-World/pull/2',
            closed_at: '2020-02-13T18:30:28Z',
            merged_at: '2020-02-13T18:30:28Z',
            merge_commit_sha: '123456',
        }
    }
};

describe('createChangelist action', () => {
    it('should call Issue.getName and Gus.createChangeListInGus with workitem from title', async () => {
        Gus.getWorkItemIdByName.mockReturnValue('a071234');
        await fn(req);
        expect(Gus.getWorkItemIdByName).toHaveBeenCalledWith('W-1234567');

        expect(Gus.createChangelistInGus).toHaveBeenCalledWith(
            'Codertocat/Hello-World/pull/2',
            'a071234',
            '2019-05-15T15:20:33Z'
        );
    });

    it('should call Issue.getName and Gus.createChangeListInGus with workitem from body', async () => {
        Gus.getWorkItemIdByName.mockReset();
        Gus.getWorkItemIdByName.mockReturnValue('a071234');
        await fn(reqWithWorkItemInBody);
        expect(Gus.getWorkItemIdByName).toHaveBeenCalledWith('W-7654321');

        expect(Gus.createChangelistInGus).toHaveBeenCalledWith(
            'Codertocat/Hello-World/pull/2',
            'a071234',
            '2019-05-15T15:20:33Z'
        );
    });

    it('should not create work item when work item not in title', async () => {
        Gus.getWorkItemIdByName.mockReset();
        Gus.getWorkItemIdByName.mockReturnValue('a071234');
        await fn(reqWithoutWorkItem);
        expect(Gus.getWorkItemIdByName).toHaveBeenCalledTimes(0);
    });

    it('should not create work item when work item in wrong format', async () => {
        Gus.getWorkItemIdByName.mockReset();
        Gus.getWorkItemIdByName.mockReturnValue('a071234');
        await fn(reqWithWorkItemInWrongFormat);
        expect(Gus.getWorkItemIdByName).toHaveBeenCalledTimes(0);
    });

    it('should not create a changelist if PR did not merge', async () => {
        Gus.getWorkItemIdByName.mockReset();
        Gus.getWorkItemIdByName.mockReturnValue('a071234');

        const reqWithUnmergedClosedPullRequest = {
            body: {
                pull_request: {
                    title: 'did not merge title W-1234567',
                    html_url:
                        'https://github.com/Codertocat/Hello-World/pull/300',
                    closed_at: '2020-02-13T18:30:28Z',
                    merged_at: null,
                    merge_commit_sha: '123456',
                    head: {
                        sha: '123456',
                        repo: {
                            html_url:
                                'https://github.com/Codertocat/Hello-World'
                        }
                    }
                }
            }
        };

        await fn(reqWithUnmergedClosedPullRequest);
        expect(Gus.getWorkItemIdByName).toHaveBeenCalledTimes(0);
    });
});
