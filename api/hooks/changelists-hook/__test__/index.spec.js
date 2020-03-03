/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { queue } = require('./../index')();

jest.mock('../create-changelist', () => {
    return async () => {
        return Promise.resolve({
            work: 'workitem',
            changelist: 'changelist-url.com',
            checkInDate: '2020-02-12T17:37:12Z'
        });
    };
});

describe('changelists-hook queue', () => {
    describe('consumer', () => {
        it('should call the done function with the value returned from the handler func', doneTest => {
            expect.assertions(1);
            const done = (error, item) => {
                expect(item).toEqual({
                    work: 'workitem',
                    changelist: 'changelist-url.com',
                    checkInDate: '2020-02-12T17:37:12Z'
                });
                doneTest();
            };
            queue.push(
                {
                    name: 'CREATE_CHANGELIST'
                },
                done
            );
        });
    });
});
