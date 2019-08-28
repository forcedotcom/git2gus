/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const unlinkWorkItem = require('..');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByName: jest.fn(),
    update: jest.fn()
}));
const task = {
    workItemName: '1234567890'
};

describe('unlinkWorkItem issues hook', () => {
    it('should call Issues.getByName with the right value', () => {
        unlinkWorkItem(task);
        expect(Issues.getByName).toHaveBeenCalledWith('1234567890');
    });
    it('should call Issues.update with the right values when the issue already exists', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByName.mockReset();
        Issues.getByName.mockReturnValue(
            Promise.resolve({
                id: '1234qwerty'
            })
        );
        await unlinkWorkItem(task);
        expect(Issues.update).toHaveBeenCalledWith('1234qwerty', {
            relatedUrl: null
        });
    });
    it('should not call Issues.update when the issue does not exists', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByName.mockReset();
        Issues.getByName.mockReturnValue(null);
        await unlinkWorkItem(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
