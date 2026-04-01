/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * ConfigValidator Service
 *
 * Validates git2gus configuration JSON structure and values.
 * Returns detailed validation results with specific error messages.
 */

const VALID_STATUS_VALUES = ['INTEGRATE', 'FIXED', 'CLOSED'];

module.exports = {
    /**
     * Validate a configuration JSON string
     * @param {string} configJson - JSON string to validate
     * @returns {object} Validation result with valid, errors, warnings, and config
     */
    validate(configJson) {
        const errors = [];
        const warnings = [];
        let config = null;

        // Step 1: Parse JSON
        try {
            config = JSON.parse(configJson);
        } catch (e) {
            return {
                valid: false,
                errors: [
                    {
                        field: 'json',
                        message: `Invalid JSON syntax: ${e.message}`
                    }
                ],
                warnings: [],
                config: null
            };
        }

        // Step 2: Validate it's an object
        if (typeof config !== 'object' || config === null) {
            errors.push({
                field: 'root',
                message:
                    'Configuration must be a JSON object, not null, string, or array.'
            });
            return { valid: false, errors, warnings, config: null };
        }

        if (Array.isArray(config)) {
            errors.push({
                field: 'root',
                message: 'Configuration must be a JSON object, not an array.'
            });
            return { valid: false, errors, warnings, config: null };
        }

        // Step 3: Validate required fields (matching original getConfig.js logic)

        // defaultBuild is required (truthy check like original)
        if (!config.defaultBuild) {
            errors.push({
                field: 'defaultBuild',
                message:
                    'Required field "defaultBuild" is missing or empty. Add: "defaultBuild": "218" (your sprint/build number)'
            });
        } else if (typeof config.defaultBuild !== 'string') {
            errors.push({
                field: 'defaultBuild',
                message: 'Field "defaultBuild" must be a string.'
            });
        }

        // productTag OR productTagLabels is required (truthy check like original)
        if (!config.productTag && !config.productTagLabels) {
            errors.push({
                field: 'productTag',
                message:
                    'At least one of "productTag" or "productTagLabels" is required. Add: "productTag": "a1aB0000000Jgm7IAC"'
            });
        }

        // Step 4: Validate optional fields if present

        // productTag
        if (config.productTag !== undefined) {
            if (typeof config.productTag !== 'string') {
                errors.push({
                    field: 'productTag',
                    message:
                        'Field "productTag" must be a string (Salesforce product tag ID).'
                });
            } else if (config.productTag.trim() === '') {
                errors.push({
                    field: 'productTag',
                    message: 'Field "productTag" cannot be an empty string.'
                });
            }
        }

        // productTagLabels
        if (config.productTagLabels !== undefined) {
            if (
                typeof config.productTagLabels !== 'object' ||
                Array.isArray(config.productTagLabels) ||
                config.productTagLabels === null
            ) {
                errors.push({
                    field: 'productTagLabels',
                    message:
                        'Field "productTagLabels" must be an object mapping label names to product tag IDs.'
                });
            } else {
                // Validate each key-value pair
                Object.entries(config.productTagLabels).forEach(
                    ([key, value]) => {
                        if (typeof value !== 'string') {
                            errors.push({
                                field: 'productTagLabels',
                                message: `Field "productTagLabels.${key}" must be a string (Salesforce product tag ID).`
                            });
                        }
                    }
                );
            }
        }

        // statusWhenClosed
        if (config.statusWhenClosed !== undefined) {
            if (typeof config.statusWhenClosed !== 'string') {
                errors.push({
                    field: 'statusWhenClosed',
                    message: 'Field "statusWhenClosed" must be a string.'
                });
            } else if (!VALID_STATUS_VALUES.includes(config.statusWhenClosed)) {
                errors.push({
                    field: 'statusWhenClosed',
                    message: `Invalid "statusWhenClosed" value: "${
                        config.statusWhenClosed
                    }". Must be one of: ${VALID_STATUS_VALUES.join(', ')}`
                });
            }
        }

        // hideWorkItemUrl
        if (config.hideWorkItemUrl !== undefined) {
            if (typeof config.hideWorkItemUrl !== 'string') {
                errors.push({
                    field: 'hideWorkItemUrl',
                    message: 'Field "hideWorkItemUrl" must be a string.'
                });
            } else if (
                config.hideWorkItemUrl !== 'true' &&
                config.hideWorkItemUrl !== 'false'
            ) {
                warnings.push({
                    field: 'hideWorkItemUrl',
                    message: `Field "hideWorkItemUrl" should be "true" or "false" (as strings). Got: "${config.hideWorkItemUrl}"`
                });
            }
        }

        // issueTypeLabels
        if (config.issueTypeLabels !== undefined) {
            if (
                typeof config.issueTypeLabels !== 'object' ||
                Array.isArray(config.issueTypeLabels) ||
                config.issueTypeLabels === null
            ) {
                errors.push({
                    field: 'issueTypeLabels',
                    message:
                        'Field "issueTypeLabels" must be an object mapping custom labels to standard labels.'
                });
            } else {
                Object.entries(config.issueTypeLabels).forEach(
                    ([key, value]) => {
                        if (typeof value !== 'string') {
                            errors.push({
                                field: 'issueTypeLabels',
                                message: `Field "issueTypeLabels.${key}" must be a string.`
                            });
                        }
                    }
                );
            }
        }

        // issueEpicMapping
        if (config.issueEpicMapping !== undefined) {
            if (
                typeof config.issueEpicMapping !== 'object' ||
                Array.isArray(config.issueEpicMapping) ||
                config.issueEpicMapping === null
            ) {
                errors.push({
                    field: 'issueEpicMapping',
                    message:
                        'Field "issueEpicMapping" must be an object mapping issue labels to epic IDs.'
                });
            } else {
                Object.entries(config.issueEpicMapping).forEach(
                    ([key, value]) => {
                        if (typeof value !== 'string') {
                            errors.push({
                                field: 'issueEpicMapping',
                                message: `Field "issueEpicMapping.${key}" must be a string (Salesforce epic ID).`
                            });
                        }
                    }
                );
            }
        }

        // gusTitlePrefix
        if (config.gusTitlePrefix !== undefined) {
            if (typeof config.gusTitlePrefix !== 'string') {
                errors.push({
                    field: 'gusTitlePrefix',
                    message: 'Field "gusTitlePrefix" must be a string.'
                });
            }
        }

        // Step 5: Check for unknown fields (add as warnings)
        const knownFields = [
            'productTag',
            'productTagLabels',
            'defaultBuild',
            'statusWhenClosed',
            'hideWorkItemUrl',
            'issueTypeLabels',
            'issueEpicMapping',
            'gusTitlePrefix'
        ];

        Object.keys(config).forEach(field => {
            if (!knownFields.includes(field)) {
                warnings.push({
                    field,
                    message: `Unknown field "${field}" will be ignored.`
                });
            }
        });

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            config
        };
    }
};
