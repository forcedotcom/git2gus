const isGusItemClosed = require('../isGusItemClosed');

global.sails = {
    config: {
        gus: {
            status: [
                'INTEGRATE',
                'FIXED',
                'CLOSED',
            ],
        },
    },
};

describe('isGusItemClosed git2gus service', () => {
    it('should return true when status is closed', () => {
        const labels = [
            'INTEGRATE',
            'FIXED',
            'CLOSED',
        ];
        labels.forEach((label) => {
            expect(isGusItemClosed(label)).toBe(true);
        });
    });
    it('should return false when not a valid closed status is passed', () => {
        expect(isGusItemClosed('other status')).toBe(false);
    });
});
