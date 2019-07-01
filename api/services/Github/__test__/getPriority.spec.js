const getPriority = require('../getPriority');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels: ghLabels
    }
};

describe('getPriority github service', () => {
    it('should return the lower priority', () => {
        const labels = [
            { name: 'GUS P2' },
            { name: 'bug' },
            { name: 'GUS P0' },
            { name: 'GUS P1' }
        ];
        expect(getPriority(labels)).toBe('P0');
    });
    it('should return the right priority when only one label is passed', () => {
        const labels = [{ name: 'GUS P2' }];
        expect(getPriority(labels)).toBe('P2');
    });
    it('should return undefined when an empty array is passed', () => {
        expect(getPriority([])).toBeUndefined();
    });
    it('should return undefined when an array with not gus labels is passed', () => {
        const labels = [
            { name: 'chore' },
            { name: 'bug' },
            { name: 'refactor' }
        ];
        expect(getPriority(labels)).toBeUndefined();
    });
});
