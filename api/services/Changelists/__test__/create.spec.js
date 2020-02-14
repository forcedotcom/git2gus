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
        work: 'a07B0000009abcdXYZ',
        changelist: 'http://some-url.com',
        checkInBy: '005B0000001ABCD',
        checkInDate: '2019-12-17T16:59:27.000Z',
        comment: 'some comment',
        task: 'some task'
    }))
);
global.Changelists = {
    create: jest.fn(() => ({
        fetch: jest.fn(() => Promise.resolve('created changelist'))
    }))
};

const data = {
    work: 'a07B0000009abcdXYZ',
    changelist: 'http://some-url.com',
    checkInBy: '005B0000001ABCD',
    checkInDate: '2019-12-17T16:59:27.000Z',
    comment: 'some comment',
    task: 'some task'
};

describe('create changelist service', () => {
    it('should call pick with the right values', () => {
        create(data);
        expect(pick).toHaveBeenCalledWith(data, [
            'work',
            'changelist',
            'checkInBy',
            'checkInDate',
            'comment',
            'task'
        ]);
    });
    it('should call Changelists.create with the right values', () => {
        global.Changelists.create.mockReset();
        create(data);
        expect(global.Changelists.create).toHaveBeenCalledWith({
            work: 'a07B0000009abcdXYZ',
            changelist: 'http://some-url.com',
            checkInBy: '005B0000001ABCD',
            checkInDate: '2019-12-17T16:59:27.000Z',
            comment: 'some comment',
            task: 'some task'
        });
    });
    it('should return the changelist create', async () => {
        global.Changelists.create.mockReset();
        global.Changelists.create.mockReturnValue({
            fetch: () => Promise.resolve('created changelist')
        });
        const changelist = await create(data);
        expect(changelist).toBe('created changelist');
    });
});
