/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const updateWorkItemDescription = require('..');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByRelatedUrl: jest.fn(),
    weCreateIssue: jest.fn(),
    update: jest.fn()
}));
const task = {
    description: 'new description',
    relatedUrl: 'github/test-git2gus-app/#5'
};

describe('updateWorkItemDescription issues hook', () => {
    it('should call Issues.getByRelatedUrl with the right value', () => {
        updateWorkItemDescription(task);
        expect(Issues.getByRelatedUrl).toHaveBeenCalledWith(
            'github/test-git2gus-app/#5'
        );
    });
    it('should call Issues.update with the right values when the issue already exists and is created by us', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234qwerty'
            })
        );
        Issues.weCreateIssue.mockReturnValue(true);
        await updateWorkItemDescription(task);
        expect(Issues.update).toHaveBeenCalledWith('1234qwerty', {
            description: 'new description'
        });
    });
    it('should not call Issues.update when the issue already exists but is not created by us', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234qwerty'
            })
        );
        Issues.weCreateIssue.mockReturnValue(false);
        await updateWorkItemDescription(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
    it('should not call Issues.update when the issue does not exists', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(null);
        await updateWorkItemDescription(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
