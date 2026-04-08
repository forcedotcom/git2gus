/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const ConfigValidator = require('../ConfigValidator');

module.exports = async function getConfig({ octokitClient, owner, repo }) {
    const file = await octokitClient.repos.getContent({
        owner,
        repo,
        path: '.git2gus/config.json'
    });
    const buffer = Buffer.from(file.data.content, 'base64');
    const jsonData = buffer.toString();

    // Use ConfigValidator service for consistent validation
    const validationResult = ConfigValidator.validate(jsonData);

    if (validationResult.valid) {
        return validationResult.config;
    }

    return Promise.reject({
        status: 'BAD_CONFIG_FILE',
        message: 'Wrong config received.',
        ...validationResult
    });
};
