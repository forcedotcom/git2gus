const deleteComment = require('../deleteComment');

process.env.TOKEN_ORGS = 'SSOEnabledOrg';

describe('deleteComment github service', () => {
    it('should call deleteComment with the right values', async () => {
        const req = {
            body: {
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
                    deleteComment: jest.fn()
                }
            }
        };
        await deleteComment({
            req,
            id: 'comment-46'
        });
        expect(req.octokitClient.issues.deleteComment).toHaveBeenCalledWith({
            owner: 'pepe',
            repo: 'test-app',
            comment_id: 'comment-46'
        });
    });
});
