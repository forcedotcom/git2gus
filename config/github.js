/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports.github = {
    secret: process.env.GITHUB_WEBHOOK_SECRET,
    appId: process.env.GITHUB_APP_ID,
    installationEvents: [
        'installation',
        'integration_installation',
        'integration_installation_repositories',
        'installation_repositories'
    ],
    approvedOrgs: process.env.GITHUB_APPROVED_ORGS
        ? process.env.GITHUB_APPROVED_ORGS.split(',')
        : []
};
