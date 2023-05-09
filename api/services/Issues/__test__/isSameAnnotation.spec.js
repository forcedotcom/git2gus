/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const isSameAnnotation = require('../isSameAnnotation');

describe('isSameAnnotation issues service', () => {
    const annotations = ['@W-12345@', 'GUS-W-12345'];

    it('should return true when is same annotation', () => {
        const descriptions = [
            '@W-12345@',
            'some text @W-12345@',
            'text@W-12345@',
            'some @W-12345@ text',
            'some@W-12345@text',
            'GUS-W-12345',
            'some text GUS-W-12345',
            'textGUS-W-12345',
            'some GUS-W-12345 text',
            'someGUS-W-12345text'
        ];
        descriptions.forEach(description => {
            annotations.forEach(annotation => {
                expect(isSameAnnotation(description, annotation)).toBe(true);
            });
        });
    });
    it('should return false when is not the same annotation', () => {
        const descriptions = [
            '@W-1234@',
            '@W-123456@',
            'W-12345',
            '@12345@',
            '@-12345@',
            '@W12345@',
            'some text W-12345@',
            'text@W-12345',
            'GUS-W-12345678',
            'some text GUS-W-12345678',
            'textGUS-W-12345678',
            'some GUS-W-12345678 text',
            'someGUS-W-12345678text',
            '',
            null,
            undefined,
            {},
            [],
            12345
        ];
        descriptions.forEach(description => {
            annotations.forEach(annotation => {
                expect(isSameAnnotation(description, annotation)).toBe(false);
            });
        });
    });
    it('should return false when both descriptions passed are null', () => {
        expect(isSameAnnotation(null, null)).toBe(false);
    });
});
