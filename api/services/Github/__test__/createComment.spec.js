const createComment = require('../createComment');

const req = {
    body: {
        issue: {
            number: 30,
        },
        repository: {
            name: 'git2gus-test',
            owner: {
                login: 'john',
            },
        },
    },
    octokitClient: {
        issues: {
            createComment: jest.fn(),
        },
    },
};

describe('createComment github service', () => {
    it('should call createComment with the right values', async () => {
        await createComment({
            req,
            body: 'Hello World!',
        });
        expect(req.octokitClient.issues.createComment).toHaveBeenCalledWith({
            owner: 'john',
            repo: 'git2gus-test',
            number: 30,
            body: 'Hello World!',
        });
    });
});
