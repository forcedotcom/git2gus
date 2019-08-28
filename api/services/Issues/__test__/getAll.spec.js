/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getAll = require('../getAll');

global.Issues = {
    find: jest.fn(() => ({
        limit: jest.fn()
    }))
};

describe('getAll issues service', () => {
    it('should call Issues.find with the right value', () => {
        getAll();
        expect(Issues.find).toHaveBeenCalledWith({});
    });
    it('should Issues.find().limit with the right value', () => {
        global.Issues.find.mockReset();
        global.Issues.find.mockReturnValue({
            limit: jest.fn()
        });
        getAll();
        expect(Issues.find().limit).toHaveBeenCalledWith(25);
    });
});
