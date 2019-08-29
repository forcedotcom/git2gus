/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const updateWorkItemRecordTypeId = require('..');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByRelatedUrl: jest.fn(),
    update: jest.fn()
}));
const task = {
    recordTypeId: 'story123',
    relatedUrl: 'github/test-app/#230'
};

describe('updateWorkItemRecordTypeId issues hook', () => {
    it('should call Issues.getByRelatedUrl with the right value', () => {
        updateWorkItemRecordTypeId(task);
        expect(Issues.getByRelatedUrl).toHaveBeenCalledWith(
            'github/test-app/#230'
        );
    });
    it('should call Issues.update with the right values when the issue is linked and the record type is different', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234abcd',
                recordTypeId: 'bug123'
            })
        );
        await updateWorkItemRecordTypeId(task);
        expect(Issues.update).toHaveBeenCalledWith('1234abcd', {
            recordTypeId: 'story123'
        });
    });
    it('should not call Issues.update when the issue is linked but the record type is the same', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234abcd',
                recordTypeId: 'story123'
            })
        );
        await updateWorkItemRecordTypeId(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
    it('should not call Issues.update when the issue is linked but the new record type is undefined', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234abcd',
                recordTypeId: 'story123'
            })
        );
        await updateWorkItemRecordTypeId({ ...task, recordTypeId: undefined });
        expect(Issues.update).not.toHaveBeenCalled();
    });
    it('should not call Issues.update when the issue is not linked', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(Promise.resolve(null));
        await updateWorkItemRecordTypeId(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
