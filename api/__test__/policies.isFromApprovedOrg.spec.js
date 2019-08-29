/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const isFromApprovedOrg = require('../policies/isFromApprovedOrg');

const res = {
    badRequest: jest.fn()
};
const next = jest.fn();

process.env.GITHUB_APPROVED_ORGS = 'salesforce,forcedotcom,sfdc';

global.sails = {
    config: {
        github: {
            approvedOrgs: process.env.GITHUB_APPROVED_ORGS.split(','),
            installationEvents: [
                'installation',
                'integration_installation',
                'integration_installation_repositories',
                'installation_repositories'
            ]
        }
    }
};

describe('isFromApprovedOrg policy', () => {
    it('should call next when event is one of installations and owner is salesforce', () => {
        sails.config.github.installationEvents.forEach(event => {
            next.mockReset();
            const req = {
                headers: {
                    'x-github-event': event
                },
                body: {
                    installation: {
                        account: {
                            login: 'salesforce'
                        }
                    }
                }
            };
            isFromApprovedOrg(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
    it('should respond with bad request when event is one of installations and owner is not salesforce', () => {
        sails.config.github.installationEvents.forEach(event => {
            next.mockReset();
            const req = {
                headers: {
                    'x-github-event': event
                },
                body: {
                    installation: {
                        account: {
                            login: 'john doe'
                        }
                    }
                }
            };
            isFromApprovedOrg(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(res.badRequest).toHaveBeenCalledWith({
                code: 'BAD_GITHUB_REQUEST',
                message: 'The request received is not from an approved org.'
            });
        });
    });
    it('should call next when event is other than the installations and owner is salesforce', () => {
        next.mockReset();
        const req = {
            headers: {
                'x-github-event': 'issues'
            },
            body: {
                repository: {
                    owner: {
                        login: 'salesforce'
                    }
                }
            }
        };
        isFromApprovedOrg(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });
    it('should respond with bad request when event is other than the installations and owner is not salesforce', () => {
        next.mockReset();
        res.badRequest.mockReset();
        const req = {
            headers: {
                'x-github-event': 'issues'
            },
            body: {
                repository: {
                    owner: {
                        login: 'pepe'
                    }
                }
            }
        };
        isFromApprovedOrg(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.badRequest).toHaveBeenCalledWith({
            code: 'BAD_GITHUB_REQUEST',
            message: 'The request received is not from an approved org.'
        });
    });
    it('should allows salesforce org installations', () => {
        const req = {
            body: {
                installation: { account: { login: 'Sfdc' } }
            },
            headers: {
                'x-github-event': 'installation'
            }
        };
        const next = jest.fn();
        isFromApprovedOrg(req, {}, next);
        expect(next).toHaveBeenCalledTimes(1);
    });
    it('should allows regular event from salesforce orgs', () => {
        const req = {
            body: {
                repository: { owner: { login: 'salesforce' } }
            },
            headers: {
                'x-github-event': 'foo'
            }
        };
        const next = jest.fn();
        isFromApprovedOrg(req, {}, next);
        expect(next).toHaveBeenCalledTimes(1);
    });
    it('should block event from non-salesforce orgs', () => {
        const req = {
            body: {
                repository: { owner: { login: 'reiniergs' } }
            },
            headers: {
                'x-github-event': 'foo'
            }
        };
        const next = jest.fn();
        const res = { badRequest: jest.fn() };
        isFromApprovedOrg(req, res, next);
        expect(res.badRequest).toHaveBeenCalledTimes(1);
    });
    it('should block org that contains salesforce in the name', () => {
        const req = {
            body: {
                repository: { owner: { login: 'salesforce-fake' } }
            },
            headers: {
                'x-github-event': 'foo'
            }
        };
        const next = jest.fn();
        const res = { badRequest: jest.fn() };
        isFromApprovedOrg(req, res, next);
        expect(res.badRequest).toHaveBeenCalledTimes(1);
    });
});
