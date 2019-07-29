const { fn } = require('../integrateWorkItem');
const { isWorkItemClosed } = require('../../services/Git2Gus');

jest.mock('../../services/Git2Gus', () => ({
    isWorkItemClosed: jest.fn()
}));
global.sails = {
    hooks: {
        'issues-hook': {
            queue: {
                push: jest.fn()
            }
        }
    }
};

describe('integrateWorkItem action', () => {
    it('should call queue push with the right values when there is not statusWhenClosed in config', () => {
        const req = {
            body: {
                issue: { url: 'github/pepe/test-app/#53' }
            },
            git2gus: {
                config: {}
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'INTEGRATE_WORK_ITEM',
            relatedUrl: 'github/pepe/test-app/#53',
            status: 'INTEGRATE'
        });
    });
    it('should call queue push with the right values when there is a valid statusWhenClosed in config', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        isWorkItemClosed.mockReturnValue(true);
        const req = {
            body: {
                issue: { url: 'github/pepe/test-app/#53' }
            },
            git2gus: {
                config: {
                    statusWhenClosed: 'CLOSED'
                }
            }
        };
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'INTEGRATE_WORK_ITEM',
            relatedUrl: 'github/pepe/test-app/#53',
            status: 'CLOSED'
        });
    });
});
