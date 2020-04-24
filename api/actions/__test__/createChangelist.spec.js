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
            url: 'https://api.github.com/repos/someuser/git2gustest/pulls/74',
            closed_at: '2020-02-13T18:30:28Z'
        }
    }
};

const reqWithoutWorkItem = {
    body: {
        pull_request: {
            title: 'pull request title',
            url: 'https://api.github.com/repos/someuser/git2gustest/pulls/74',
            closed_at: '2020-02-13T18:30:28Z'
        }
    }
};

const reqWithWorkItemInWrongFormat = {
    body: {
        pull_request: {
            title: 'pull request title W-1234567',
            url: 'https://api.github.com/repos/someuser/git2gustest/pulls/74',
            closed_at: '2020-02-13T18:30:28Z'
        }
    }
};

describe('createChangelist action', () => {
    it('should call Issue.getName and Gus.createChangeListInGus with the right value', async () => {
        Gus.getWorkItemIdByName.mockReturnValue('a071234');
        await fn(req);
        expect(Gus.getWorkItemIdByName).toHaveBeenCalledWith('W-1234567');

        expect(Gus.createChangelistInGus).toHaveBeenCalledWith(
            'someuser/git2gustest/pull/74',
            'a071234'
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
});
