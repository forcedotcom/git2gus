const createComment = require('../createComment');

process.env.TOKEN_ORGS = 'SSOEnabledOrg';

describe('createComment github service', () => {
    it('should call createComment with the right values in an issue', async () => {
        const req = {
            body: {
                issue: {
                    number: 30
                },
                repository: {
                    name: 'git2gus-test',
                    owner: {
                        login: 'john'
                    },
                    url: 'https://api.github.com/repos/notSSOOrg/repository'
                }
            },
            octokitClient: {
                issues: {
                    createComment: jest.fn()
                }
            }
        };
        await createComment({
            req,
            body: 'Hello World!'
        });
        expect(req.octokitClient.issues.createComment).toHaveBeenCalledWith({
            owner: 'john',
            repo: 'git2gus-test',
            issue_number: 30,
            body: 'Hello World!'
        });
    });
    it('should call createComment with the right values in an pull request', async () => {
        const req = {
            body: {
                pull_request: {},
                number: 35,
                repository: {
                    name: 'test-app',
                    owner: {
                        login: 'pepe'
                    },
                    url: 'github.com/notSSOEnabledOrg'
                }
            },
            octokitClient: {
                issues: {
                    createComment: jest.fn()
                }
            }
        };
        await createComment({
            req,
            body: 'Hello World Pull Request!'
        });
        expect(req.octokitClient.issues.createComment).toHaveBeenCalledWith({
            owner: 'pepe',
            repo: 'test-app',
            issue_number: 35,
            body: 'Hello World Pull Request!'
        });
    });
});
