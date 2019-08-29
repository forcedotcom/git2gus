/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const integrateWorkItem = require('..');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByRelatedUrl: jest.fn(),
    update: jest.fn()
}));
const payload = {
    relatedUrl: 'github/test-app/#45',
    status: 'INTEGRATE'
};

describe('integrateWorkItem issues hook', () => {
    it('should call Issues.update with the right values when the issue exists', async () => {
        expect.assertions(1);
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234qwerty',
                status: 'NEW'
            })
        );
        await integrateWorkItem(payload);
        expect(Issues.update).toHaveBeenCalledWith('1234qwerty', {
            status: 'INTEGRATE'
        });
    });
    it('should not call Issues.update when issue is closed', async () => {
        expect.assertions(1);
        Issues.getByRelatedUrl.mockReset();
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(
            Promise.resolve({
                id: '1234qwerty',
                status: 'CLOSED'
            })
        );
        await integrateWorkItem(payload);
        expect(Issues.update).not.toHaveBeenCalled();
    });
    it('should not call Issues.update when the issue does not exists', async () => {
        expect.assertions(1);
        Issues.getByRelatedUrl.mockReset();
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(null);
        await integrateWorkItem(payload);
        expect(Issues.update).not.toHaveBeenCalled();
    });
});
