const { fn } = require('./../createGusLabels');

global.sails = {
    config: {
        gus: {
            labels: [
                'GUS P0',
                'GUS P1',
                'GUS P2',
                'GUS P3',
            ],
            labelColor: '#ccc',
        },
    },
};

const req = {
    body: {
        repositories: [{ name: 'repo-1' }, { name: 'repo-2' }, { name: 'repo-3' }],
        installation: {
            account: {
                login: 'john',
            },
        },
    },
    octokitClient: {
        issues: {
            createLabel: jest.fn(),
        },
    },
};

describe('createGusLabels', () => {
    it('should call createLabel 4 times for each repository', () => {
        fn(req);
        expect(req.octokitClient.issues.createLabel).toHaveBeenCalledTimes(12);
    });
    it('should call createLabel with the right values', () => {
        req.octokitClient.issues.createLabel.mockReset();
        fn(req);
        expect(req.octokitClient.issues.createLabel.mock.calls[0][0]).toEqual({
            owner: 'john',
            repo: 'repo-1',
            name: 'GUS P0',
            color: '#ccc',
        });
    });
});
