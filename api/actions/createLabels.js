/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const GithubEvents = require('../modules/GithubEvents');
const logger = require('../services/Logs/logger');

function getRepositories(req) {
    if (
        GithubEvents.match(
            req,
            GithubEvents.events.INSTALLATION_REPOSITORIES_ADDED
        )
    ) {
        return req.body.repositories_added;
    }
    return req.body.repositories;
}

module.exports = {
    eventName: [
        GithubEvents.events.INSTALLATION_CREATED,
        GithubEvents.events.INSTALLATION_REPOSITORIES_ADDED
    ],
    fn: async function(req) {
        const {
            installation: {
                id: installationId,
                account: { login: owner }
            }
        } = req.body;
        const repositories = getRepositories(req);
        logger.info('INTENT_CREATING_LABELS', {
            installationId,
            owner
        });
        repositories.forEach(async repository => {
            const repo = repository.name;
            const {
                bugLabels,
                bugLabelColor,
                investigationLabels,
                investigationLabelColor,
                userStoryLabel,
                userStoryLabelColor
            } = sails.config.ghLabels;

            // add the bug labels
            bugLabels.forEach(async name => {
                const label = {
                    owner,
                    repo,
                    name,
                    color: bugLabelColor
                };
                logger.info('INTENT_CREATING_LABEL', {
                    installationId,
                    ...label
                });
                try {
                    await req.octokitClient.issues.createLabel(label);
                } catch (err) {
                    logger.error('ERROR_CREATING_LABEL', {
                        message: err.toString(),
                        installationId,
                        ...label
                    });
                }
            });

            // add the investigation labels
            investigationLabels.forEach(async name => {
                const label = {
                    owner,
                    repo,
                    name,
                    color: investigationLabelColor
                };
                logger.info('INTENT_CREATING_LABEL', {
                    installationId,
                    ...label
                });
                try {
                    await req.octokitClient.issues.createLabel(label);
                } catch (err) {
                    logger.error('ERROR_CREATING_LABEL', {
                        message: err.toString(),
                        installationId,
                        ...label
                    });
                }
            });

            // add the story label
            logger.info('INTENT_CREATING_LABEL', {
                installationId,
                owner,
                repo,
                name: userStoryLabel,
                color: bugLabelColor
            });
            try {
                await req.octokitClient.issues.createLabel({
                    owner,
                    repo,
                    name: userStoryLabel,
                    color: userStoryLabelColor
                });
            } catch (err) {
                logger.error('ERROR_CREATING_LABEL', {
                    message: err.toString(),
                    installationId,
                    owner,
                    repo,
                    name: userStoryLabel,
                    color: userStoryLabelColor
                });
            }
        });
    }
};
