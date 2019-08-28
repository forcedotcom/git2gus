/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { fn } = require('../createLabels');
const { ghLabels } = require('../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels
    }
};

const req = {
    headers: {
        'x-github-event': 'installation'
    },
    body: {
        repositories: [
            { name: 'repo-1' },
            { name: 'repo-2' },
            { name: 'repo-3' }
        ],
        installation: {
            account: {
                login: 'john'
            }
        },
        action: 'created'
    },
    octokitClient: {
        issues: {
            createLabel: jest.fn()
        }
    }
};

const reqOrg = {
    headers: {
        'x-github-event': 'installation_repositories'
    },
    body: {
        repositories_added: [
            { name: 'repo-1' },
            { name: 'repo-2' },
            { name: 'repo-3' }
        ],
        installation: {
            account: {
                login: 'john'
            }
        },
        action: 'added'
    },
    octokitClient: {
        issues: {
            createLabel: jest.fn()
        }
    }
};

describe('createLabels', () => {
    describe('type user', () => {
        it('should call createLabel 9 times for each repository', () => {
            fn(req);
            expect(req.octokitClient.issues.createLabel).toHaveBeenCalledTimes(
                27
            );
        });
        it('should call createLabel with the bug label', () => {
            req.octokitClient.issues.createLabel.mockReset();
            fn(req);
            expect(
                req.octokitClient.issues.createLabel.mock.calls[0][0]
            ).toEqual({
                owner: 'john',
                repo: 'repo-1',
                name: 'BUG P0',
                color: 'ededed'
            });
        });
        it('should call createLabel with the investigation label', () => {
            req.octokitClient.issues.createLabel.mockReset();
            fn(req);
            expect(
                req.octokitClient.issues.createLabel.mock.calls[8][0]
            ).toEqual({
                owner: 'john',
                repo: 'repo-1',
                name: 'USER STORY',
                color: 'a2eeef'
            });
        });
    });
    describe('type organization', () => {
        it('should call createLabel 9 times for each repository', () => {
            fn(reqOrg);
            expect(
                reqOrg.octokitClient.issues.createLabel
            ).toHaveBeenCalledTimes(27);
        });
        it('should call createLabel with the bug label', () => {
            reqOrg.octokitClient.issues.createLabel.mockReset();
            fn(reqOrg);
            expect(
                reqOrg.octokitClient.issues.createLabel.mock.calls[0][0]
            ).toEqual({
                owner: 'john',
                repo: 'repo-1',
                name: 'BUG P0',
                color: 'ededed'
            });
        });
        it('should call createLabel with the investigation label', () => {
            reqOrg.octokitClient.issues.createLabel.mockReset();
            fn(reqOrg);
            expect(
                reqOrg.octokitClient.issues.createLabel.mock.calls[8][0]
            ).toEqual({
                owner: 'john',
                repo: 'repo-1',
                name: 'USER STORY',
                color: 'a2eeef'
            });
        });
    });
});
