const isFromSalesforceOrg = require('./../isFromSalesforceOrg');

describe('isSalesforceOrg policy', () => {
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
