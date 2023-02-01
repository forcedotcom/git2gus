/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const updateWorkItemPriority = require('..');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByRelatedUrl: jest.fn(),
    update: jest.fn()
}));
const task = {
    priority: 'P2',
    relatedUrl: 'github/test-app/#230'
};

describe('updateWorkItemPriority issues hook', () => {
    it('should call Issues.getByRelatedUrl with the right value', () => {
        updateWorkItemPriority(task);
        expect(Issues.getByRelatedUrl).toHaveBeenCalledWith(
            'github/test-app/#230'
        );
    });
    it('should call Issues.update with the right values when the issue is linked and the new priority is great', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234abcd',
                priority: 'P1'
            })
        );
        await updateWorkItemPriority(task);
        expect(Issues.update).toHaveBeenCalledWith('1234abcd', {
            priority: 'P2'
        });
    });
    describe('should not call Issues.update when the issue is linked but the priority is not great', () => {
        // TODO set the 'priority' field to the right datatype once the todo in updateWorkItemPriority is resolved
        const taskArray = [
            {
                priority: 1,
                relatedUrl: 'github/test-app/#230'
            },
            {
                priority: 2,
                relatedUrl: 'github/test-app/#230'
            }
        ];
        it.each(taskArray)('priority %o', async taskItem => {
            Issues.update.mockReset();
            Issues.getByRelatedUrl.mockReset();
            Issues.getByRelatedUrl.mockReturnValue(
                Promise.resolve({
                    id: '1234abcd',
                    priority: 100 // high priority
                })
            );
            await updateWorkItemPriority(taskItem);
            expect(Issues.update).not.toHaveBeenCalled();
        });
    });
    it('should not call Issues.update when the issue is not linked', async () => {
        expect.assertions(1);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(Promise.resolve(null));
        await updateWorkItemPriority(task);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
