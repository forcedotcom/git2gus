/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getById = require('../getById');

global.Issues = {
    findOne: jest.fn()
};

describe('getById issues service', () => {
    it('should call Issues.findOne with the right value', () => {
        getById('issue-135');
        expect(Issues.findOne).toHaveBeenCalledWith({
            id: 'issue-135'
        });
    });
});
