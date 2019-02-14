const { createComment } = require('./../Github');

const req = {
    body: {
        issue: {
            url: 'github/git2gus-test/#30',
            title: 'new issue',
            body: 'some description',
            number: 30,
        },
        label: 'GUS P1',
        repository: {
            name: 'git2gus-test',
            owner: {
                login: 'john',
            },
        },
    },
    git2gus: {
        config: {
            productTag: 'abcd1234',
            defaultBuild: '218',
        },
    },
    octokitClient: {
        issues: {
            createComment: jest.fn(),
        },
    },
};

describe('Github service', () => {
    describe('createComment', () => {
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
});
