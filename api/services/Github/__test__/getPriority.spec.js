/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getPriority = require('../getPriority');
const { ghLabels } = require('../../../../config/ghLabels');

global.sails = {
    config: {
        ghLabels: ghLabels
    }
};

describe('getPriority github service', () => {
    it('should return the lower priority for bug labels', () => {
        const labels = [
            { name: 'BUG P2' },
            { name: 'bug' },
            { name: 'BUG P0' },
            { name: 'BUG P1' }
        ];
        expect(getPriority(labels)).toBe('P0');
    });
    it('should return the lower priority for investigation labels', () => {
        const labels = [
            { name: 'INVESTIGATION P2' },
            { name: 'investigation' },
            { name: 'INVESTIGATION P0' },
            { name: 'INVESTIGATION P1' }
        ];
        expect(getPriority(labels)).toBe('P0');
    });
    it('should return the right priority when only one bug label is passed', () => {
        const labels = [{ name: 'BUG P2' }];
        expect(getPriority(labels)).toBe('P2');
    });
    it('should return the right priority when only one investigation label is passed', () => {
        const labels = [{ name: 'INVESTIGATION P1' }];
        expect(getPriority(labels)).toBe('P1');
    });
    it('should return undefined when an empty array is passed', () => {
        expect(getPriority([])).toBeUndefined();
    });
    it('should return undefined when an array with not salesforce labels is passed', () => {
        const labels = [
            { name: 'chore' },
            { name: 'bug' },
            { name: 'refactor' }
        ];
        expect(getPriority(labels)).toBeUndefined();
    });
});
