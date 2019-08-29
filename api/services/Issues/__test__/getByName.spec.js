/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getByName = require('../getByName');

global.Issues = {
    findOne: jest.fn()
};

describe('getByName issues service', () => {
    it('should call Issues.findOne with the right value', () => {
        getByName('abcd1234');
        expect(Issues.findOne).toHaveBeenCalledWith({
            name: 'abcd1234'
        });
    });
});
