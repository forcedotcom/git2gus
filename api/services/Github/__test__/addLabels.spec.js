const addLabels = require('../addLabels');

process.env.TOKEN_ORGS = 'SSOEnabledOrg';

describe('addLabels github service', () => {
    it('should call addLabels with the right values', async () => {
        const req = {
            body: {
                issue: {
                    number: 30
                },
                repository: {
                    name: 'git2gus-test-app',
                    owner: {
                        login: 'pepe'
                    },
                    url: 'https://api.github.com/repos/notSSOOrg/repository'
                }
            },
            octokitClient: {
                issues: {
                    addLabels: jest.fn()
                }
            }
        };
        await addLabels({
            req,
            labels: ['GUS P1', 'GUS P2']
        });
        expect(req.octokitClient.issues.addLabels).toHaveBeenCalledWith({
            owner: 'pepe',
            repo: 'git2gus-test-app',
            number: 30,
            labels: ['GUS P1', 'GUS P2']
        });
    });
    it('should call addLabels with token client for SSO org', async () => {
        const req = {
            body: {
                issue: {
                    number: 30
                },
                repository: {
                    name: 'git2gus-test-app',
                    owner: {
                        login: 'pepe'
                    },
                    url: 'https://api.github.com/repos/SSOEnabledOrg/repository'
                }
            },
            octokitTokenClient: {
                issues: {
                    addLabels: jest.fn()
                }
            }
        };
        await addLabels({
            req,
            labels: ['GUS P1', 'GUS P2']
        });
        expect(req.octokitTokenClient.issues.addLabels).toHaveBeenCalledWith({
            owner: 'pepe',
            repo: 'git2gus-test-app',
            number: 30,
            labels: ['GUS P1', 'GUS P2']
        });
    });
});
