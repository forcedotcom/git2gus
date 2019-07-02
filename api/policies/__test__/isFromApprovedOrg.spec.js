const isFromApprovedOrg = require('../isFromApprovedOrg');

const res = {
    badRequest: jest.fn()
};
const next = jest.fn();

global.sails = {
    config: {
        github: {
            approvedOrgs: ['salesforce', 'forcedotcom'],
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
});
