/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { fn } = require('../createChangelist');
const Issues = require('../../services/Issues');

global.sails = {
    hooks: {
        'changelists-hook': {
            queue: {
                push: jest.fn()
            }
        }
    }
};

jest.mock('../../services/Issues', () => ({
    getByName: jest.fn()
}));

const req = {
    body: {
        pull_request: {
            title: 'pull request title @W-1234567@',
            url: 'github/git2gus-app/pr-1',
            closed_at: '2020-02-13T18:30:28Z'
        }
    }
};

describe('createChangelist action', () => {
    it('should call Issue.getName with the right value', () => {
        fn(req);
        expect(Issues.getByName).toHaveBeenCalledWith('W-1234567');
    });
});
