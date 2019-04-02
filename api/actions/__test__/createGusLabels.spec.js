const { fn } = require('./../createGusLabels');

global.sails = {
    config: {
        gus: {
            labels: ['GUS P0', 'GUS P1', 'GUS P2', 'GUS P3'],
            labelColor: '#ccc'
        }
    }
};

const req = {
    headers: {
        'x-github-event': 'installation'
    },
    body: {
        repositories: [
            { name: 'repo-1' },
            { name: 'repo-2' },
            { name: 'repo-3' }
        ],
        installation: {
            account: {
                login: 'john'
            }
        },
        action: 'created'
    },
    octokitClient: {
        issues: {
            createLabel: jest.fn()
        }
    }
};

const reqOrg = {
    headers: {
        'x-github-event': 'installation_repositories'
    },
    body: {
        repositories_added: [
            { name: 'repo-1' },
            { name: 'repo-2' },
            { name: 'repo-3' }
        ],
        installation: {
            account: {
                login: 'john'
            }
        },
        action: 'added'
    },
    octokitClient: {
        issues: {
            createLabel: jest.fn()
        }
    }
};

describe('createGusLabels', () => {
    describe('type user', () => {
        it('should call createLabel 4 times for each repository', () => {
            fn(req);
            expect(req.octokitClient.issues.createLabel).toHaveBeenCalledTimes(
                12
            );
        });
        it('should call createLabel with the right values', () => {
            req.octokitClient.issues.createLabel.mockReset();
            fn(req);
            expect(
                req.octokitClient.issues.createLabel.mock.calls[0][0]
            ).toEqual({
                owner: 'john',
                repo: 'repo-1',
                name: 'GUS P0',
                color: '#ccc'
            });
        });
    });
    describe('type organization', () => {
        it('should call createLabel 4 times for each repository', () => {
            fn(reqOrg);
            expect(
                reqOrg.octokitClient.issues.createLabel
            ).toHaveBeenCalledTimes(12);
        });
        it('should call createLabel with the right values', () => {
            reqOrg.octokitClient.issues.createLabel.mockReset();
            fn(reqOrg);
            expect(
                reqOrg.octokitClient.issues.createLabel.mock.calls[0][0]
            ).toEqual({
                owner: 'john',
                repo: 'repo-1',
                name: 'GUS P0',
                color: '#ccc'
            });
        });
    });
});
