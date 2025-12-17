/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const logger = require('../services/Logs/logger');

function isApprovedOrg(name) {
    return sails.config.github.approvedOrgs.some(org => {
        return org.toLowerCase() === name.toLowerCase();
    });
}

module.exports = function isApprovedReq(req, res, next) {
    const github = sails.config.github;
    const { repository, installation } = req.body;
    const event = req.headers['x-github-event'];

    // Extract org name once
    const orgName = repository
        ? repository.owner.login
        : (installation?.account?.login || 'unknown');

    const isApprovedInstallation =
        github.installationEvents.indexOf(event) !== -1 &&
        installation.account &&
        isApprovedOrg(installation.account.login);
    const isEventFromApprovedSource =
        repository && isApprovedOrg(repository.owner.login);

    const isFromDevelopmentGithubRepo =
        process.env.NODE_ENV === 'development' &&
        process.env.GITHUB_TEST_ORG &&
        ((repository &&
            repository.owner.login === process.env.GITHUB_TEST_ORG) ||
            (installation.account &&
                installation.account.login === process.env.GITHUB_TEST_ORG));

    if (
        isApprovedInstallation ||
        isEventFromApprovedSource ||
        isFromDevelopmentGithubRepo
    ) {
        logger.info(`Request approved from org: ${orgName}, event: ${event}`);
        return next();
    }

    const approvedOrgs = github.approvedOrgs.join(', ');
    logger.error(`REQUEST REJECTED - Organization '${orgName}' is not in approved orgs list. Event: ${event}, Approved orgs: [${approvedOrgs}]`);

    return res.badRequest({
        code: 'BAD_GITHUB_REQUEST',
        message: 'The request received is not from an approved org.'
    });
};
