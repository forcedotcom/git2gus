const { fn } = require('./../integrateGusItem');
const { isGusItemClosed } = require('../../services/Git2Gus');

jest.mock('../../services/Git2Gus', () => ({
    isGusItemClosed: jest.fn()
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

describe('integrateGusItem action', () => {
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
            name: 'INTEGRATE_GUS_ITEM',
            relatedUrl: 'github/pepe/test-app/#53',
            status: 'INTEGRATED'
        });
    });
    it('should call queue push with the right values when there is a valid statusWhenClosed in config', () => {
        sails.hooks['issues-hook'].queue.push.mockReset();
        isGusItemClosed.mockReturnValue(true);
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
            name: 'INTEGRATE_GUS_ITEM',
            relatedUrl: 'github/pepe/test-app/#53',
            status: 'CLOSED'
        });
    });
});
