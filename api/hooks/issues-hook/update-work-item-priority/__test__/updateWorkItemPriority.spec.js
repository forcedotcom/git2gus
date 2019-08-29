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
    it('should not call Issues.update when the issue is linked but the priority is not great', async () => {
        expect.assertions(2);
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234abcd',
                priority: 'P1'
            })
        );
        const taskArray = [
            {
                priority: 'P1',
                relatedUrl: 'github/test-app/#230'
            },
            {
                priority: 'P2',
                relatedUrl: 'github/test-app/#230'
            }
        ];
        taskArray.forEach(async taskItem => {
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
