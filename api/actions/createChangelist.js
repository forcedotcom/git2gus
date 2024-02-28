/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Gus = require('../services/Gus');
const { convertUrlToGusFormat } = require('./utils/convertUrlToGusFormat');
const GithubEvents = require('../modules/GithubEvents');
const logger = require('../services/Logs/logger');

module.exports = {
    eventName: GithubEvents.events.PULL_REQUEST_CLOSED,
    fn: async function(req) {
        logger.info('createChangelist() Action called successfully');
        const {
            pull_request: {
                title,
                html_url: pr_url,
                body,
                merged_at,
            }
        } = req.body;

        if (!merged_at) {
            logger.info(
                `Skipping createChangelistInGus() because merged_at is null. PR was closed without merging`,
                { pr_url, title }
            );
            return;
        }
        logger.info(`Extracted merged_at:${merged_at} from the req`);

        const workItemInTitleOrBody = title
            .concat(body)
            .match('@[Ww]-\\d{6,8}@');
        logger.info(
            `Extracted workItem Id:${workItemInTitleOrBody} from the req`
        );

        if (workItemInTitleOrBody) {
            const workItemName = workItemInTitleOrBody[0].substring(
                1,
                workItemInTitleOrBody[0].length - 1
            );
            logger.info(`Extracted workItemName:${workItemName} from the req`);

            const changelistUrl = convertUrlToGusFormat(
                pr_url
            );
            logger.info(
                `changelistUrl to be appended to the GUS workitem: ${changelistUrl}`
            );

            try {
                const issueId = await Gus.getWorkItemIdByName(workItemName);
                logger.info(
                    `Creating changelist in GUS for issueId: ${issueId}, changelistUrl: ${changelistUrl}, merged_at: ${merged_at}`
                );
                Gus.createChangelistInGus(changelistUrl, issueId, merged_at);
            } catch (error) {
                logger.error(`createChangelistInGus() errored: ${error}`);
            }
        }
    }
};
