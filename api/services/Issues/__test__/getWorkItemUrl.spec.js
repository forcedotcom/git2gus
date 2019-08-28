/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getWorkItemUrl = require('../getWorkItemUrl');

describe('getWorkItemUrl issues service', () => {
    it('should retrun the right work item url', () => {
        process.env.WORK_ITEM_BASE_URL =
            'https://gus.lightning.force.com/lightning/r/ADM_Work__c/';
        const workItemUrl = getWorkItemUrl({
            sfid: 'qwerty1234'
        });
        expect(workItemUrl).toBe(
            'https://gus.lightning.force.com/lightning/r/ADM_Work__c/qwerty1234/view'
        );
    });

    it('should retrun the work item name when hideUrl argument is true', () => {
        process.env.WORK_ITEM_BASE_URL =
            'https://gus.lightning.force.com/lightning/r/ADM_Work__c/';
        const workItemUrl = getWorkItemUrl(
            {
                name: 'W-234123',
                sfid: 'qwerty1234'
            },
            true
        );
        expect(workItemUrl).toBe('W-234123');
    });
});
