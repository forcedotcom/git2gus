const { fn } = require('../createDeletedLabel');
const Github = require('../../services/Github');
const { ghLabels } = require('../../../config/ghLabels');

jest.mock('../../services/Github', () => ({
    isSalesforceLabel: jest.fn()
}));

global.sails = {
    hooks: {
        'labels-hook': {
            queue: {
                push: jest.fn()
            }
        }
    },
    config: {
        ghLabels
    }
};

const req = {
    body: {
        label: { name: 'BUG P1', color: 'ededed' },
        repository: {
            name: 'test-app',
            owner: {
                login: 'pepe'
            }
        }
    },
    octokitClient: {
        issues: {
            createLabel: jest.fn()
        }
    }
};

describe('createDeletedLabel action', () => {
    it('should queue the label creation when the label deleted is a Salesforce label', () => {
        Github.isSalesforceLabel.mockReturnValue(true);
        fn(req);
        expect(sails.hooks['labels-hook'].queue.push).toHaveBeenCalledWith({
            execute: expect.any(Function)
        });
    });
    it('should not queue the label creation for different label', () => {
        Github.isSalesforceLabel.mockReturnValue(false);
        sails.hooks['labels-hook'].queue.push.mockReset();
        expect(sails.hooks['labels-hook'].queue.push).not.toHaveBeenCalled();
    });
    describe('execute', () => {
        it('should call createLabel with the right values', async () => {
            expect.assertions(1);
            Github.isSalesforceLabel.mockReturnValue(true);
            fn(req);
            const { execute } = sails.hooks[
                'labels-hook'
            ].queue.push.mock.calls[0][0];
            await execute();
            expect(req.octokitClient.issues.createLabel).toHaveBeenCalledWith({
                owner: 'pepe',
                repo: 'test-app',
                name: 'BUG P1',
                color: 'ededed'
            });
        });
    });
});