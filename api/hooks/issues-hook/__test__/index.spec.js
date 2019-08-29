/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { queue } = require('./../index')();

jest.mock('../create-or-update-work-item', () => {
    return async () => {
        return Promise.resolve({ id: 12345 });
    };
});

describe('issues-hook queue', () => {
    describe('consumer', () => {
        it('should call the done function with the value returned from the handler func', doneTest => {
            expect.assertions(1);
            const done = (error, item) => {
                expect(item).toEqual({ id: 12345 });
                doneTest();
            };
            queue.push(
                {
                    name: 'CREATE_WORK_ITEM'
                },
                done
            );
        });
    });
});
