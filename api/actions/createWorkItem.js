/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { getTitleWithOptionalPrefix } = require("./getTitleWithOptionalPrefix");

const { updateIssue } = require("./updateIssue");

const { formatToGus } = require("./formatToGus");

const GithubEvents = require('../modules/GithubEvents');
const Github = require('../services/Github');
const Gus = require('../services/Gus');
const logger = require('../services/Logs/logger');

module.exports = {
    eventName: GithubEvents.events.ISSUE_LABELED,
    fn: async function (req) {
        logger.info('createWorkItem Action called');
        const {
            issue: { labels, html_url, body, milestone }
        } = req.body;
        let {
            issue: { title }
        } = req.body;
        // Only grab the label being added for comparison against Salesforce labels
        const { label: labelAdded } = req.body;
        const { config } = req.git2gus;
        const { hideWorkItemUrl } = config;
        let productTag = config.productTag;
        if (config.productTagLabels) {
            logger.info('createWorkItem will work with custom productTagLabels for issue titled: ', title);
            Object.keys(config.productTagLabels).forEach(productTagLabel => {
                if (labels.some(label => label.name === productTagLabel)) {
                    productTag = config.productTagLabels[productTagLabel];
                }
            });
        }
        if (config.issueTypeLabels) {
            logger.info('createWorkItem will work with custom issueTypeLabels for issue titled: ', title);
            Object.keys(config.issueTypeLabels).forEach(issueTypeLabel => {
                // If the label added is a Salesforce custom label, give it the correct base label
                if (labelAdded.name === issueTypeLabel) {
                    labelAdded.name = config.issueTypeLabels[issueTypeLabel];
                }
                if (labels.some(label => label.name === issueTypeLabel)) {
                    labels.push({ name: config.issueTypeLabels[issueTypeLabel] });
                }
            });
        }

        let epicId = null;
        if (config.issueEpicMapping) {
            try {
                logger.info('createWorkItem will find custom epic mapping for issue titled: ', title);
                Object.keys(config.issueEpicMapping).forEach(issueEpic => {
                    logger.info(issueEpic);
                    if (issueEpic === labelAdded.name) {
                        epicId = config.issueEpicMapping[issueEpic];
                    }
                });
                logger.info('createWorkItem identified epicId: ', epicId );
            } catch (e) {
                logger.error(`Error while creating work item ${e.message}`, e);
                return await updateIssue(req, 'Error while creating work item!');
            }
        } else {
            logger.info('no epic mapping found');
        }

        let normalizedTitle = getTitleWithOptionalPrefix(config, title);
        logger.info('createWorkItem will create GUS work item with title: ', normalizedTitle);
        // Only check the label being added
        if (Github.isSalesforceLabel(labelAdded.name) && productTag) {
            logger.info('Verified valid label and product tag for issue titled: ', title);
            const priority = Github.getPriority(labels);
            logger.info(`Found priority: ${priority} for issue titled: ${title}`);
            const recordTypeId = Github.getRecordTypeId(labels);
            logger.info(`Found recordTypeId: ${recordTypeId} for issue titled: ${title}`);
            const bodyInGusFormat = await formatToGus(html_url, body);
            logger.info(`Found bodyInGusFormat: ${bodyInGusFormat} for issue titled: ${title}`);

            logger.info(`Using GUS Api to create workitem for issue titled: ${title}`);
            // default build to "undefined", to invoke our updateIssue error below
            const buildName = milestone ? milestone.title : config.defaultBuild;
            const foundInBuild = await Gus.resolveBuild(buildName);
            logger.info(`Found foundInBuild: ${foundInBuild} for issue titled: ${title}`);

            const issue = await Gus.getByRelatedUrl(html_url);
            if (issue) {
                logger.info(`Found existing Work "${issue.Name}" for issue "${html_url}"`);
            } else {
                logger.info(`No existing Work for issue "${html_url}"`);
            }
            const bugRecordTypeId = Gus.getBugRecordTypeId();

            const alreadyLowestPriority =
                issue && issue[Gus.field('Priority')] !== '' && issue[Gus.field('Priority')] <= priority;
            const recordTypeIdIsSame = issue && issue.RecordTypeId === recordTypeId;
            const isRecordTypeBug = recordTypeId === bugRecordTypeId;

            // If issue is a bug we check if it already exists and already has lowest priority
            // If issue type is investigation or story, we simply check it exists
            if (isRecordTypeBug && alreadyLowestPriority && recordTypeIdIsSame) {
                logger.info(`Not opening new bug because existing bug has lower priority`);
                return;
            } else if (!isRecordTypeBug && recordTypeIdIsSame) {
                logger.info(`Not opening new bug because existing Work is another record type`);
                return;
            }

            if (foundInBuild) {
                try {
                    logger.info('Calling GUS API to create a new work item');
                    const syncedItem = await Gus.createWorkItemInGus(normalizedTitle,
                        bodyInGusFormat,
                        productTag,
                        'NEW',
                        foundInBuild,
                        priority,
                        html_url,
                        recordTypeId,
                        epicId);
                    const syncedItemFromGus = await Gus.getById(syncedItem.id);
                    logger.info('###hideWorkItemUrl:' + hideWorkItemUrl);
                    const displayUrl = (hideWorkItemUrl === 'true') ? syncedItemFromGus.Name : `[${syncedItemFromGus.Name}](${process.env.WORK_ITEM_BASE_URL + syncedItem.id}/view)`;
                    const msg = `This issue has been linked to a new work item: ${displayUrl}`;
                    logger.info(msg, ' for issue titled: ', title);
                    return await updateIssue(req, msg);
                } catch (e) {
                    logger.error(`Error while creating work item ${e.message}`, e);
                    return await updateIssue(req, 'Error while creating work item!');
                }
            } else {
                logger.error(`No correct build for issue titled: ${title}`);
                return await updateIssue(req, 'Error while creating work item. No valid build found in GUS!');
            }
        }
        logger.error('Failed to create work item for issue titled: ', title);
        return null;
    }
};
