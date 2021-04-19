/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { fn } = require('../integrateWorkItem');
const { isWorkItemClosed } = require('../../services/Git2Gus');
const Gus = require('../../services/Gus');

jest.mock('../../services/Git2Gus', () => ({
    isWorkItemClosed: jest.fn()
}));
jest.mock('../../services/Gus', () => ({
    closeWorkItem: jest.fn()
}));

describe('integrateWorkItem action', () => {
    it('should call queue push with the right values when there is not statusWhenClosed in config', async () => {
        const req = {
            body: {
                issue: { html_url: 'github/pepe/test-app/#53' }
            },
            git2gus: {
                config: {}
            }
        };
        await fn(req);
        expect(Gus.closeWorkItem).toHaveBeenCalledWith(
            'github/pepe/test-app/#53',
            'INTEGRATE'
        );
    });
    it('should call queue push with the right values when there is a valid statusWhenClosed in config', async () => {
        isWorkItemClosed.mockReturnValue(true);
        const req = {
            body: {
                issue: { html_url: 'github/pepe/test-app/#53' }
            },
            git2gus: {
                config: {
                    statusWhenClosed: 'CLOSED'
                }
            }
        };
        await fn(req);
        expect(Gus.closeWorkItem).toHaveBeenCalledWith(
            'github/pepe/test-app/#53',
            'CLOSED'
        );
    });
});
