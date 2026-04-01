/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const ConfigController = require('../controllers/ConfigController');

// Mock the ConfigValidator service
global.ConfigValidator = {
    validate: jest.fn()
};

describe('ConfigController', () => {
    describe('showValidator action', () => {
        it('should render the config-validator view', () => {
            const req = {};
            const res = {
                view: jest.fn()
            };

            ConfigController.showValidator(req, res);

            expect(res.view).toHaveBeenCalledWith('pages/config-validator');
        });
    });

    describe('validateConfig action', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return validation result for valid config', async () => {
            const configObj = {
                productTag: 'a1aB0000000Jgm7IAC',
                defaultBuild: '218'
            };
            const req = {
                body: {
                    config: JSON.stringify(configObj)
                }
            };
            const res = {
                json: jest.fn()
            };

            // Mock successful validation
            ConfigValidator.validate.mockReturnValue({
                valid: true,
                errors: [],
                warnings: [],
                config: configObj
            });

            await ConfigController.validateConfig(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    valid: true,
                    errors: [],
                    config: expect.objectContaining({
                        productTag: 'a1aB0000000Jgm7IAC',
                        defaultBuild: '218'
                    })
                })
            );
        });

        it('should return validation errors for invalid config', async () => {
            const req = {
                body: {
                    config: JSON.stringify({
                        productTag: 'a1aB0000000Jgm7IAC'
                        // missing defaultBuild
                    })
                }
            };
            const res = {
                json: jest.fn()
            };

            // Mock validation failure
            ConfigValidator.validate.mockReturnValue({
                valid: false,
                errors: [
                    {
                        field: 'defaultBuild',
                        message:
                            'Required field "defaultBuild" is missing or empty.'
                    }
                ],
                warnings: [],
                config: null
            });

            await ConfigController.validateConfig(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    valid: false,
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'defaultBuild'
                        })
                    ])
                })
            );
        });

        it('should return error when no config provided', async () => {
            const req = {
                body: {}
            };
            const res = {
                json: jest.fn()
            };

            await ConfigController.validateConfig(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    valid: false,
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'config',
                            message: 'No configuration provided.'
                        })
                    ])
                })
            );
        });

        it('should return error for malformed JSON', async () => {
            const req = {
                body: {
                    config: '{invalid json}'
                }
            };
            const res = {
                json: jest.fn()
            };

            // Mock JSON syntax error
            ConfigValidator.validate.mockReturnValue({
                valid: false,
                errors: [
                    {
                        field: 'json',
                        message:
                            'Invalid JSON syntax: Unexpected token i in JSON at position 1'
                    }
                ],
                warnings: [],
                config: null
            });

            await ConfigController.validateConfig(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    valid: false,
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'json',
                            message: expect.stringContaining(
                                'Invalid JSON syntax'
                            )
                        })
                    ])
                })
            );
        });
    });
});
