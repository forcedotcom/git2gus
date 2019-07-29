const addLabels = require('../addLabels');

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
                    }
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
            labels: ['BUG P1', 'BUG P2']
        });
        expect(req.octokitClient.issues.addLabels).toHaveBeenCalledWith({
            owner: 'pepe',
            repo: 'git2gus-test-app',
            number: 30,
            labels: ['BUG P1', 'BUG P2']
        });
    });
});
