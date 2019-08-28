/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const verify = require('@octokit/webhooks/verify');
const { github } = require('../../config/github');

module.exports = function isGithubReq(req, res, next) {
    const signature = req.headers['x-hub-signature'];
    const payload = req.body;
    if (
        github.secret &&
        payload &&
        signature &&
        verify(github.secret, payload, signature)
    ) {
        return next();
    }
    return res.badRequest({
        status: 'BAD_GITHUB_REQUEST',
        message: 'Wrong event payload received.'
    });
};
