const { fn } = require('./../integrateGusItem');

global.sails = {
    hooks: {
        'issues-hook': {
            queue: {
                push: jest.fn(),
            },
        },
    },
};

const req = {
    body: {
        issue: { url: 'github/pepe/test-app/#53' },
    },
};

describe('integrateGusItem action', () => {
    it('should call queue push with the right values', () => {
        fn(req);
        expect(sails.hooks['issues-hook'].queue.push).toHaveBeenCalledWith({
            name: 'INTEGRATE_GUS_ITEM',
            relatedUrl: 'github/pepe/test-app/#53',
        });
    });
});
