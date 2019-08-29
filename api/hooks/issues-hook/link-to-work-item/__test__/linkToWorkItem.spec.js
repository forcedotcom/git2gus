/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const linkToWorkItem = require('..');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByName: jest.fn(),
    update: jest.fn()
}));
const task = {
    relatedUrl: 'github/test-app/#46',
    workItemName: '12345'
};

describe('linkToWorkItem issues hook', () => {
    it('should call Issues.getByName with the right value', () => {
        linkToWorkItem(task);
        expect(Issues.getByName).toHaveBeenCalledWith('12345');
    });
    it('should call Issues.update with the right values when the issue already exists', async () => {
        expect.assertions(1);
        Issues.getByName.mockReset();
        Issues.update.mockReset();
        Issues.getByName.mockReturnValue(
            Promise.resolve({
                id: '1234qwerty'
            })
        );
        await linkToWorkItem(task);
        expect(Issues.update).toHaveBeenCalledWith('1234qwerty', {
            relatedUrl: 'github/test-app/#46'
        });
    });
    it('should not call Issues.update when the issue does not exists', async () => {
        expect.assertions(1);
        Issues.getByName.mockReset();
        Issues.update.mockReset();
        Issues.getByName.mockReturnValue(null);
        await linkToWorkItem(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
