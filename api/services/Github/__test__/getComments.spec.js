const getComments = require('../getComments');

process.env.TOKEN_ORGS = 'SSOEnabledOrg';

describe('getComments github service', () => {
    it('should call listComments with the right values', async () => {
        const req = {
            body: {
                issue: {
                    number: 15
                },
                repository: {
                    name: 'test-app',
                    owner: {
                        login: 'pepe'
                    },
                    url: 'https://api.github.com/repos/notSSOOrg/repository'
                }
            },
            octokitClient: {
                issues: {
                    listComments: jest.fn()
                }
            }
        };
        await getComments({ req });
        expect(req.octokitClient.issues.listComments).toHaveBeenCalledWith({
            owner: 'pepe',
            repo: 'test-app',
            number: 15
        });
    });
});
