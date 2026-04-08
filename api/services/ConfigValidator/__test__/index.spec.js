/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const ConfigValidator = require('../index');

describe('ConfigValidator service', () => {
    describe('valid configurations', () => {
        it('should accept valid minimal config with productTag', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC',
                defaultBuild: '218'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.config.productTag).toBe('a1aB0000000Jgm7IAC');
            expect(result.config.defaultBuild).toBe('218');
        });

        it('should accept valid config with productTagLabels instead of productTag', () => {
            const config = JSON.stringify({
                productTagLabels: {
                    'area:lwc': 'a1aEE000000OVXJYA4',
                    'area:aura': 'a1aEE000000OVXKYA4'
                },
                defaultBuild: 'Backlog'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should accept valid config with both productTag and productTagLabels', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC',
                productTagLabels: {
                    'area:lwc': 'a1aEE000000OVXJYA4'
                },
                defaultBuild: '218'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should accept valid config with all optional fields', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC',
                defaultBuild: 'Backlog',
                statusWhenClosed: 'FIXED',
                hideWorkItemUrl: true,
                issueTypeLabels: {
                    feature: 'USER STORY',
                    urgent: 'BUG P0'
                },
                issueEpicMapping: {
                    'epic-label': 'a123456'
                },
                gusTitlePrefix: '[MyTeam]'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should accept all valid statusWhenClosed values', () => {
            ['INTEGRATE', 'FIXED', 'CLOSED'].forEach(status => {
                const config = JSON.stringify({
                    productTag: 'a1aB0000000Jgm7IAC',
                    defaultBuild: '218',
                    statusWhenClosed: status
                });

                const result = ConfigValidator.validate(config);

                expect(result.valid).toBe(true);
                expect(result.errors).toHaveLength(0);
            });
        });
    });

    describe('missing required fields', () => {
        it('should reject when defaultBuild is missing', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'defaultBuild',
                message: expect.stringContaining(
                    'Required field "defaultBuild" is missing'
                )
            });
        });

        it('should reject when both productTag and productTagLabels are missing', () => {
            const config = JSON.stringify({
                defaultBuild: '218'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'productTag',
                message: expect.stringContaining(
                    'At least one of "productTag" or "productTagLabels" is required'
                )
            });
        });

        it('should reject when defaultBuild is empty string', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC',
                defaultBuild: ''
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'defaultBuild',
                message: expect.stringContaining('missing or empty')
            });
        });
    });

    describe('invalid JSON structure', () => {
        it('should reject null JSON', () => {
            const config = 'null';

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'root',
                message: expect.stringContaining('must be a JSON object')
            });
        });

        it('should reject string JSON', () => {
            const config = '"some string"';

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'root',
                message: expect.stringContaining('must be a JSON object')
            });
        });

        it('should reject array JSON', () => {
            const config = '["value1", "value2"]';

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'root',
                message: expect.stringContaining(
                    'must be a JSON object, not an array'
                )
            });
        });

        it('should reject malformed JSON', () => {
            const config = '{invalid json}';

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors[0].field).toBe('json');
            expect(result.errors[0].message).toContain('Invalid JSON syntax');
        });
    });

    describe('invalid field values', () => {
        it('should reject invalid statusWhenClosed value', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC',
                defaultBuild: '218',
                statusWhenClosed: 'DONE'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'statusWhenClosed',
                message: expect.stringContaining(
                    'Invalid "statusWhenClosed" value'
                )
            });
        });

        it('should reject non-string defaultBuild', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC',
                defaultBuild: 218
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'defaultBuild',
                message: expect.stringContaining('must be a string')
            });
        });

        it('should reject non-object productTagLabels', () => {
            const config = JSON.stringify({
                productTagLabels: 'not an object',
                defaultBuild: '218'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'productTagLabels',
                message: expect.stringContaining('must be an object')
            });
        });

        it('should reject non-object issueTypeLabels', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC',
                defaultBuild: '218',
                issueTypeLabels: 'not an object'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'issueTypeLabels',
                message: expect.stringContaining('must be an object')
            });
        });
    });

    describe('warnings', () => {
        it('should warn about unknown fields', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC',
                defaultBuild: '218',
                unknownField: 'some value'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(true);
            expect(result.warnings).toContainEqual({
                field: 'unknownField',
                message: expect.stringContaining(
                    'Unknown field "unknownField" will be ignored'
                )
            });
        });

        it('should reject non-standard hideWorkItemUrl values', () => {
            const config = JSON.stringify({
                productTag: 'a1aB0000000Jgm7IAC',
                defaultBuild: '218',
                hideWorkItemUrl: 'yes'
            });

            const result = ConfigValidator.validate(config);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'hideWorkItemUrl',
                message: 'Field "hideWorkItemUrl" must be a boolean value.'
            });
        });
    });
});
