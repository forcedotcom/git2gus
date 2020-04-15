/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const updateDescription = require('../updateDescription');

describe('updateDescription github service', () => {
    it('should call updateDescription with the right values in an issue', async () => {
        const req = {
            body: {
                issue: {
                    number: 30,
                    body: 'old description'
                },
                repository: {
                    name: 'git2gus-test',
                    owner: {
                        login: 'john'
                    }
                }
            },
            octokitClient: {
                issues: {
                    update: jest.fn()
                }
            }
        };
        await updateDescription({
            req,
            body: 'new description'
        });
        expect(req.octokitClient.issues.update).toHaveBeenCalledWith({
            owner: 'john',
            repo: 'git2gus-test',
            issue_number: 30,
            body: 'old description' + '\n' + 'new description'
        });
    });
});
