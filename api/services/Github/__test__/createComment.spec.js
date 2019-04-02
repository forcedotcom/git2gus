const createComment = require('../createComment');

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
                    }
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
            number: 30,
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
                    }
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
            number: 35,
            body: 'Hello World Pull Request!'
        });
    });
});
