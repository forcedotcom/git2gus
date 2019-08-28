/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const App = require('@octokit/app');
const Octokit = require('@octokit/rest');
const isGithubAuth = require('../policies/isGithubAuth');

jest.mock('@octokit/rest', () => jest.fn());
jest.mock('@octokit/app', () => jest.fn());
jest.mock('fs', () => ({
    readFileSync: jest.fn(() => 'pem-file')
}));
jest.mock('../../config/github', () => ({
    github: {
        appId: 'github-app-id'
    }
}));

const testId = '410939550';
const testOrgName = 'SSOEnabledOrg';

process.env.TOKEN_ORGS = testOrgName;
process.env.PERSONAL_ACCESS_TOKEN = 'personalAccessToken123';

const req = {
    body: {
        installation: {
            id: testId
        },
        repository: {
            full_name: 'testOrg/testRepo'
        }
    }
};

const SSOReq = {
    body: {
        installation: {
            id: testId
        },
        repository: {
            full_name: testOrgName + '/testRepo'
        }
    }
};

const res = {
    status: jest.fn()
};
const next = jest.fn();

describe('isGithubAuth policy', () => {
    it('should call App with the right values', () => {
        isGithubAuth(req, res, next);
        expect(App).toHaveBeenCalledWith({
            id: 'github-app-id',
            privateKey: 'pem-file'
        });
    });
    it('should call Octokit with the right values', () => {
        Octokit.mockReset();
        isGithubAuth(req, res, next);
        expect(Octokit).toHaveBeenCalledWith({
            auth: expect.any(Function)
        });
    });
    it('should call Octokit using peronsal access token for SSO Org', () => {
        Octokit.mockReset();
        isGithubAuth(SSOReq, res, next);
        expect(Octokit).toHaveBeenCalledWith({
            auth: process.env.PERSONAL_ACCESS_TOKEN
        });
    });
    it('should attach octokitClient to req', () => {
        Octokit.mockReset();
        Octokit.mockImplementation(() => {
            return {
                createComment: 'create-github-comment'
            };
        });
        isGithubAuth(req, res, next);
        expect(req.octokitClient).toEqual({
            createComment: 'create-github-comment'
        });
    });
    it('should call next', () => {
        next.mockReset();
        isGithubAuth(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    it('should respond with 401 status when getInstallationAccessToken rejects', async () => {
        App.mockImplementation(() => {
            return {
                getInstallationAccessToken: jest.fn(() => Promise.reject())
            };
        });
        Octokit.mockImplementation(async ({ auth }) => {
            return await auth();
        });
        await isGithubAuth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
});
