/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const addLabels = require('../addLabels');

describe('addLabels github service', () => {
    it('should call addLabels with the right values', async () => {
        const req = {
            body: {
                issue: {
                    number: 30
                },
                repository: {
                    name: 'git2gus-test-app',
                    owner: {
                        login: 'pepe'
                    }
                }
            },
            octokitClient: {
                issues: {
                    addLabels: jest.fn()
                }
            }
        };
        await addLabels({
            req,
            labels: ['BUG P1', 'BUG P2']
        });
        expect(req.octokitClient.issues.addLabels).toHaveBeenCalledWith({
            owner: 'pepe',
            repo: 'git2gus-test-app',
            number: 30,
            labels: ['BUG P1', 'BUG P2']
        });
    });
});
