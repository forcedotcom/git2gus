const isFromSalesforceOrg = require('../policies/isFromSalesforceOrg');

const installationEvents = [
    'installation',
    'integration_installation',
    'integration_installation_repositories',
    'installation_repositories'
];

const res = {
    badRequest: jest.fn()
};
const next = jest.fn();

describe('isFromSalesforceOrg policy', () => {
    it('should call next when event is one of installations and owner is salesforce', () => {
        installationEvents.forEach(event => {
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
            isFromSalesforceOrg(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
    it('should respond with bad request when event is one of installations and owner is not salesforce', () => {
        installationEvents.forEach(event => {
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
            isFromSalesforceOrg(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(res.badRequest).toHaveBeenCalledWith({
                status: 'BAD_GITHUB_REQUEST',
                message: 'The request received is not from salesforce org.'
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
        isFromSalesforceOrg(req, res, next);
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
        isFromSalesforceOrg(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.badRequest).toHaveBeenCalledWith({
            status: 'BAD_GITHUB_REQUEST',
            message: 'The request received is not from salesforce org.'
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
        isFromSalesforceOrg(req, {}, next);
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
        isFromSalesforceOrg(req, {}, next);
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
        isFromSalesforceOrg(req, res, next);
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
        isFromSalesforceOrg(req, res, next);
        expect(res.badRequest).toHaveBeenCalledTimes(1);
    });
});
