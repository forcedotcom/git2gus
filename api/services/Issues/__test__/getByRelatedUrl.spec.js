/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getByRelatedUrl = require('../getByRelatedUrl');

global.Issues = {
    findOne: jest.fn()
};

describe('getByRelatedUrl issues service', () => {
    it('should call Issues.findOne with the right value', () => {
        getByRelatedUrl('github/john-doe/test-app');
        expect(Issues.findOne).toHaveBeenCalledWith({
            relatedUrl: 'github/john-doe/test-app'
        });
    });
});
