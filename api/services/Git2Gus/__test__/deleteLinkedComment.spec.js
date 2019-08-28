/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const deleteLinkedComment = require('../deleteLinkedComment');
const { getComments, deleteComment } = require('../../Github');
const getMatchedComments = require('../getMatchedComments');

jest.mock('../../Github/getComments', () =>
    jest.fn(() =>
        Promise.resolve({
            data: []
        })
    )
);
jest.mock('../../Github/deleteComment', () => jest.fn());
jest.mock('../getMatchedComments', () => jest.fn(() => []));

const req = {
    issue: {
        number: 136
    }
};
const sfid = 'ABcd1234';

describe('deleteLinkedComment git2gus service', () => {
    it('should call getComments with the right value', async () => {
        expect.assertions(1);
        await deleteLinkedComment({ req, sfid });
        expect(getComments).toHaveBeenCalledWith({
            req: {
                issue: {
                    number: 136
                }
            }
        });
    });
    it('should call getMatchedComments with the right values', async () => {
        expect.assertions(1);
        getComments.mockReset();
        getComments.mockReturnValue({
            data: [
                {
                    id: '1234',
                    body: 'some description'
                }
            ]
        });
        getMatchedComments.mockReset();
        getMatchedComments.mockReturnValue([]);
        await deleteLinkedComment({ req, sfid });
        expect(getMatchedComments).toHaveBeenCalledWith(
            [
                {
                    id: '1234',
                    body: 'some description'
                }
            ],
            'ABcd1234'
        );
    });
    it('should call deleteComment as many times as matched comments amount with the right values', async () => {
        expect.assertions(3);
        getMatchedComments.mockReset();
        getMatchedComments.mockReturnValue([
            {
                id: '1234',
                body: 'some description'
            },
            {
                id: '5678',
                body: 'another description'
            }
        ]);
        await deleteLinkedComment({ req, sfid });
        expect(deleteComment).toHaveBeenCalledTimes(2);
        expect(deleteComment.mock.calls[0][0]).toEqual({
            req: {
                issue: {
                    number: 136
                }
            },
            id: '1234'
        });
        expect(deleteComment.mock.calls[1][0]).toEqual({
            req: {
                issue: {
                    number: 136
                }
            },
            id: '5678'
        });
    });
    it('should not call deleteComment when there are not matched comments', async () => {
        expect.assertions(1);
        getMatchedComments.mockReset();
        getMatchedComments.mockReturnValue([]);
        deleteComment.mockReset();
        await deleteLinkedComment({ req, sfid });
        expect(deleteComment).not.toHaveBeenCalled();
    });
    it('should not call deleteComment when comments.data is not an array', async () => {
        expect.assertions(10);
        const values = [{}, null, undefined, 'dsa', 123];
        values.forEach(async value => {
            getComments.mockReset();
            getComments.mockReturnValue({
                data: value
            });
            getMatchedComments.mockReset();
            deleteComment.mockReset();
            await deleteLinkedComment({ req, sfid });
            expect(getMatchedComments).not.toHaveBeenCalled();
            expect(deleteComment).not.toHaveBeenCalled();
        });
    });
    it('should not call deleteComment when comments does not exists', async () => {
        expect.assertions(2);
        getComments.mockReset();
        getComments.mockReturnValue(null);
        getMatchedComments.mockReset();
        deleteComment.mockReset();
        await deleteLinkedComment({ req, sfid });
        expect(getMatchedComments).not.toHaveBeenCalled();
        expect(deleteComment).not.toHaveBeenCalled();
    });
});
