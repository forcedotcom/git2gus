/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const pick = require('lodash/pick');
const create = require('../create');

jest.mock('lodash/pick', () =>
    jest.fn(() => ({
        subject: 'issue title',
        description: 'issue description',
        productTag: 'abcd1234',
        status: 'NEW',
        foundInBuild: '218',
        priority: 'P1',
        relatedUrl: 'github/pepe/repo'
    }))
);
global.Issues = {
    create: jest.fn(() => ({
        fetch: jest.fn(() => Promise.resolve('created issue'))
    }))
};

const data = {
    subject: 'issue title',
    description: 'issue description',
    status: 'NEW'
};

describe('create issues service', () => {
    beforeEach(() => {
        global.Issues.create.mockClear();
    });
    it('should call pick with the right values', async () => {
        await create(data);
        expect(pick).toHaveBeenCalledWith(data, [
            'subject',
            'description',
            'storyDetails',
            'productTag',
            'status',
            'foundInBuild',
            'priority',
            'relatedUrl'
        ]);
    });
    it('should call Issues.create with the right values', async () => {
        await create(data);
        expect(global.Issues.create).toHaveBeenCalledWith({
            subject: 'issue title',
            description: 'issue description',
            productTag: 'abcd1234',
            status: 'NEW',
            foundInBuild: '218',
            priority: 'P1',
            relatedUrl: 'github/pepe/repo'
        });
    });
    it('should return the issue create', async () => {
        const issue = await create(data);
        expect(issue).toBe('created issue');
    });
});
