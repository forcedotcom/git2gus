/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

function isApprovedOrg(name) {
    return sails.config.github.approvedOrgs.some(org => {
        return org.toLowerCase() === name.toLowerCase();
    });
}

module.exports = function isApprovedReq(req, res, next) {
    const github = sails.config.github;
    const { repository, installation } = req.body;
    const event = req.headers['x-github-event'];
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
        return next();
    }
    return res.badRequest({
        code: 'BAD_GITHUB_REQUEST',
        message: 'The request received is not from an approved org.'
    });
};
