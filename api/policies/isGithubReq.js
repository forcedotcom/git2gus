/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const verify = require('@octokit/webhooks/verify');
const { github } = require('../../config/github');
const logger = require('../services/Logs/logger');

module.exports = function isGithubReq(req, res, next) {
    const signature = req.headers['x-hub-signature'];
    const payload = req.body;
    const event = req.headers['x-github-event'];
    
    if (
        github.secret &&
        payload &&
        signature &&
        verify(github.secret, payload, signature)
    ) {
        return next();
    }
    
    logger.error(`REQUEST REJECTED - Invalid GitHub webhook signature. Event: ${event}, Signature present: ${!!signature}`);
    
    return res.badRequest({
        status: 'BAD_GITHUB_REQUEST',
        message: 'Wrong event payload received.'
    });
};
