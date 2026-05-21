/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { formatToGus } = require('../formatToGus');

describe('formatToGus', () => {
    const testUrl = 'https://github.com/test/repo/issues/123';

    it('should format short markdown content to HTML', () => {
        const body = '# Test Issue\n\nThis is a test issue body.';
        const result = formatToGus(testUrl, body);

        expect(result).toContain('Github issue link:');
        expect(result).toContain(testUrl);
        expect(result).toContain('<h1>Test Issue</h1>');
        expect(result).toContain('<p>This is a test issue body.</p>');
    });

    it('should handle empty body', () => {
        const result = formatToGus(testUrl, '');

        expect(result).toContain('Github issue link:');
        expect(result).toContain(testUrl);
    });

    it('should handle null body', () => {
        const result = formatToGus(testUrl, null);

        expect(result).toContain('Github issue link:');
        expect(result).toContain(testUrl);
    });

    it('should truncate content exceeding MAX_MARKDOWN_LENGTH', () => {
        // Create a string longer than 10,000 characters
        const longBody = 'A'.repeat(12000);
        const result = formatToGus(testUrl, longBody);

        expect(result).toContain('Content truncated due to length');
        expect(result).toContain('See full issue on GitHub');
        // Result should be significantly shorter than the original after truncation
        expect(result.length).toBeLessThan(longBody.length);
    });

    it('should keep content under 10,000 characters intact', () => {
        const body = 'A'.repeat(9000);
        const result = formatToGus(testUrl, body);

        expect(result).not.toContain('Content truncated');
        expect(result).toContain('A'.repeat(100)); // Sample check
    });

    it('should preserve markdown formatting in truncated content', () => {
        const longBody = '# Title\n\n' + 'Content paragraph. '.repeat(1000);
        const result = formatToGus(testUrl, longBody);

        expect(result).toContain('<h1>Title</h1>');
        expect(result).toContain('Content truncated due to length');
    });

    it('should include truncation message at the end when truncated', () => {
        const longBody = 'X'.repeat(15000);
        const result = formatToGus(testUrl, longBody);

        expect(result).toContain('[Content truncated due to length. See full issue on GitHub]');
    });
});
