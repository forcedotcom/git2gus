/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const ConfigValidator = require('../services/ConfigValidator');

module.exports = {
    /**
     * Show the configuration validator page
     */
    showValidator(req, res) {
        return res.view('pages/config-validator');
    },

    /**
     * Validate a configuration JSON
     * POST /api/validate-config
     * Body: { config: "<json string>" }
     */
    async validateConfig(req, res) {
        try {
            const configJson = req.body.config;

            if (!configJson) {
                return res.json({
                    valid: false,
                    errors: [
                        {
                            field: 'config',
                            message: 'No configuration provided.'
                        }
                    ],
                    warnings: [],
                    config: null
                });
            }

            const result = ConfigValidator.validate(configJson);
            return res.json(result);
        } catch (error) {
            // Log error if sails is available (not in test environment)
            if (typeof sails !== 'undefined') {
                sails.log.error('Error validating config:', error);
            }
            return res.json({
                valid: false,
                errors: [
                    {
                        field: 'server',
                        message:
                            'Server error during validation: ' + error.message
                    }
                ],
                warnings: [],
                config: null
            });
        }
    }
};
