/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getAnnotation = require('../getAnnotation');

describe('getAnnotation issues service', () => {
    it('should return the matched annotation', () => {
        const descriptions = [
            '@W-12345678@',
            'some text @W-12345678@',
            'text@W-12345678@',
            'some @W-12345678@ text'
        ];
        descriptions.forEach(description => {
            expect(getAnnotation(description)).toBe('W-12345678');
        });
    });
    it('should return null when the description does not match the annotation', () => {
        const descriptions = [
            'W-12345678',
            '@12345678@',
            '@-12345678@',
            '@W12345678@',
            'some text W-12345678@',
            'text@W-12345678',
            '',
            null,
            undefined,
            {},
            [],
            12345678
        ];
        descriptions.forEach(description => {
            expect(getAnnotation(description)).toBe(null);
        });
    });
});
