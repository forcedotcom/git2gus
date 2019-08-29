/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getComments = require('../getComments');

describe('getComments github service', () => {
    it('should call listComments with the right values', async () => {
        const req = {
            body: {
                issue: {
                    number: 15
                },
                repository: {
                    name: 'test-app',
                    owner: {
                        login: 'pepe'
                    }
                }
            },
            octokitClient: {
                issues: {
                    listComments: jest.fn()
                }
            }
        };
        await getComments({ req });
        expect(req.octokitClient.issues.listComments).toHaveBeenCalledWith({
            owner: 'pepe',
            repo: 'test-app',
            number: 15
        });
    });
});
