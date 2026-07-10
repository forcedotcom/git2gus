/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { getConfig, createComment } = require('../services/Github');
const { github } = require('../../config/github');
const logger = require('../services/Logs/logger');

function toMarkdown(errors) {
    if (!errors || errors.length === 0) {
        return '';
    }
    const formatted = errors
        .map(({ field, message }) => `- **\`${field}\`**: ${message}`)
        .join('\n');
    return `\n\n## Errors:\n\n${formatted}`;
}

module.exports = async function hasConfig(req, res, next) {
    const { action, repository } = req.body;
    const event = req.headers['x-github-event'];

    if (github.installationEvents.indexOf(event) !== -1) {
        return next();
    }

    try {
        const config = await getConfig({
            owner: repository.owner.login,
            repo: repository.name,
            octokitClient: req.octokitClient
        });
        req.git2gus = Object.assign({}, req.git2gus, {
            config
        });
        logger.info(
            `Config loaded successfully for ${repository.owner.login}/${repository.name}`
        );
        return next();
    } catch (error) {
        const isIssueOrPrOpened =
            (event === 'issues' || event === 'pull_request') &&
            action === 'opened';
        if (error.status === 404) {
            logger.error(
                `REQUEST REJECTED - Config not found for ${repository.owner.login}/${repository.name}. Event: ${event}, Action: ${action}`
            );
            if (isIssueOrPrOpened) {
                await createComment({
                    req,
                    body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't exist.`
                });
            }
            return res.notFound({
                status: 'CONFIG_NOT_FOUND',
                message: 'The .git2gus/config.json was not found.'
            });
        }
        logger.error(
            `REQUEST REJECTED - Config error for ${repository.owner.login}/${repository.name}. Event: ${event}, Action: ${action}, Error: ${error.message}`
        );
        if (isIssueOrPrOpened) {
            await createComment({
                req,
                body: `The Git2Gus app is installed but the \`.git2gus/config.json\` failed validation.${toMarkdown(
                    error.errors
                )}${toMarkdown(error.warnings)}`
            });
        }
        return res.status(403).send(error);
    }
};
