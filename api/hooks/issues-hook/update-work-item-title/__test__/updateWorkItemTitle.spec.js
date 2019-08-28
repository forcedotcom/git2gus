/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const updateWorkItemTitle = require('..');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByRelatedUrl: jest.fn(),
    weCreateIssue: jest.fn(),
    update: jest.fn()
}));
const task = {
    subject: 'new title',
    relatedUrl: 'github/git2gus-app/#354'
};

describe('updateWorkItemTitle issues hook', () => {
    it('should call Issues.getByRelatedUrl with the right value', () => {
        updateWorkItemTitle(task);
        expect(Issues.getByRelatedUrl).toHaveBeenCalledWith(
            'github/git2gus-app/#354'
        );
    });
    it('should call Issues.update with the right values when the issue is linked and is created by us', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: 'abcd1234'
            })
        );
        Issues.weCreateIssue.mockReturnValue(true);
        await updateWorkItemTitle(task);
        expect(Issues.update).toHaveBeenCalledWith('abcd1234', {
            subject: 'new title'
        });
    });
    it('should not call Issues.update when the issue is linked but is not created by us', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: 'abcd1234'
            })
        );
        Issues.weCreateIssue.mockReturnValue(false);
        await updateWorkItemTitle(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
    it('should not call Issues.update when the issue does not exists', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(null);
        await updateWorkItemTitle(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
