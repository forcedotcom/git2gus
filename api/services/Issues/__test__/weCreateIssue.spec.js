/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const weCreateIssue = require('../weCreateIssue');

global.sails = {
    config: {
        salesforce: {
            salesforceUserId: 'abcd1234'
        }
    }
};

describe('weCreateIssue issues service', () => {
    it('should return true when createdById match with the Salesforce user id', () => {
        const issue = {
            createdById: 'abcd1234'
        };
        expect(weCreateIssue(issue)).toBe(true);
    });
    it('should return false when createdById does not match with the Salesforce user id', () => {
        const issue = {
            createdById: 'qwerty1234'
        };
        expect(weCreateIssue(issue)).toBe(false);
    });
});
