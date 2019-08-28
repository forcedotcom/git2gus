/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const isWorkItemClosed = require('../isWorkItemClosed');

global.sails = {
    config: {
        salesforce: {
            status: ['INTEGRATE', 'FIXED', 'CLOSED']
        }
    }
};

describe('isWorkItemClosed git2gus service', () => {
    it('should return true when status is closed', () => {
        const labels = ['INTEGRATE', 'FIXED', 'CLOSED'];
        labels.forEach(label => {
            expect(isWorkItemClosed(label)).toBe(true);
        });
    });
    it('should return false when not a valid closed status is passed', () => {
        expect(isWorkItemClosed('other status')).toBe(false);
    });
});
