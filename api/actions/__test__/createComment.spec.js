/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { fn } = require('../createComment');
const Gus = require('../../services/Gus');

jest.mock('../../services/Gus', () => ({
    createComment: jest.fn(),
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
            body:
                'some description\n\ndescription with workitem @W-7654321@\n\nmore description'
        }
    }
};

const reqWithoutWorkItem = {
    body: {
        pull_request: {
            title: 'pull request title with no workitemId',
            html_url: 'https://github.com/Codertocat/Hello-World/pull/2',
            body: ''
        }
    }
};

describe('createChatterComment action', () => {
    it('should call Issue.getName and Gus.createComment with workitem from title', async () => {
        Gus.getWorkItemIdByName.mockReturnValue('a071234');
        await fn(req);
        expect(Gus.getWorkItemIdByName).toHaveBeenCalledWith('W-1234567');

        expect(Gus.createComment).toHaveBeenCalledWith(
            'A Pull Request is now open for this work item https://github.com/Codertocat/Hello-World/commit/123456',
            'a071234'
        );
    });

    it('should not create work item when work item not in title', async () => {
        Gus.getWorkItemIdByName.mockReset();
        Gus.getWorkItemIdByName.mockReturnValue('a071234');
        await fn(reqWithoutWorkItem);
        expect(Gus.getWorkItemIdByName).toHaveBeenCalledTimes(0);
    });
});
