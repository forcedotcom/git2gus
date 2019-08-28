/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const verify = require('@octokit/webhooks/verify');
const isGithubReq = require('../policies/isGithubReq');

jest.mock('@octokit/webhooks/verify', () => jest.fn());
jest.mock('../../config/github', () => ({
    github: {
        secret: 'github-webhook-secret'
    }
}));

const req = {
    headers: {
        'x-hub-signature': 'github-sign'
    },
    body: {
        issue: {
            id: '410939550'
        }
    }
};
const res = {
    badRequest: jest.fn()
};
const next = jest.fn();

beforeEach(() => {
    res.badRequest.mockReset();
    next.mockReset();
    verify.mockReset();
});

describe('isGithubReq policy', () => {
    it('should call verify with the right values', () => {
        isGithubReq(req, res, next);
        expect(verify).toHaveBeenCalledWith(
            'github-webhook-secret',
            {
                issue: {
                    id: '410939550'
                }
            },
            'github-sign'
        );
    });
    it('should call next', () => {
        verify.mockReturnValue(true);
        isGithubReq(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });
    it('should respond with bad request when there is not payload', () => {
        verify.mockReturnValue(true);
        const request = {
            headers: {
                'x-hub-signature': 'github-sign'
            }
        };
        isGithubReq(request, res, next);
        expect(res.badRequest).toHaveBeenCalledWith({
            status: 'BAD_GITHUB_REQUEST',
            message: 'Wrong event payload received.'
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('should respond with bad request when there is not signature', () => {
        verify.mockReturnValue(true);
        const request = {
            headers: {},
            body: {}
        };
        isGithubReq(request, res, next);
        expect(res.badRequest).toHaveBeenCalledWith({
            status: 'BAD_GITHUB_REQUEST',
            message: 'Wrong event payload received.'
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('should respond with bad request when verify fails', () => {
        verify.mockReturnValue(false);
        isGithubReq(req, res, next);
        expect(res.badRequest).toHaveBeenCalledWith({
            status: 'BAD_GITHUB_REQUEST',
            message: 'Wrong event payload received.'
        });
        expect(next).not.toHaveBeenCalled();
    });
});
