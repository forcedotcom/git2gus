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
const Builds = require('../services/Builds');
const Github = require('../services/Github');
const Gus = require('../services/Gus');
const { getWorkItemUrl, waitUntilSynced } = require('../services/Issues');

function getBuildErrorMessage(config, milestone) {
    if (milestone) {
        return `The milestone assigned to the issue doesn't match any valid build in Salesforce.`;
    }
    return `The defaultBuild value ${
        config.defaultBuild
    } in \`.git2gus/config.json\` doesn't match any valid build in Salesforce.`;
}

module.exports = {
    eventName: GithubEvents.events.ISSUE_LABELED,
    fn: async function (req) {
        console.log('createWorkItem Action called with req: ', req);
        const {
            issue: { labels, html_url, body, milestone }
        } = req.body;
        let {
            issue: { title }
        } = req.body;
        const { config } = req.git2gus;
        const { hideWorkItemUrl } = config;
        let productTag = config.productTag;
        if (config.productTagLabels) {
            console.log('createWorkItem will work with custom productTagLabels for issue titled: ', title);
            Object.keys(config.productTagLabels).forEach(productTagLabel => {
                if (labels.some(label => label.name === productTagLabel)) {
                    productTag = config.productTagLabels[productTagLabel];
                }
            });
        }
        if(config.issueTypeLabels) {
            console.log('createWorkItem will work with custom issueTypeLabels for issue titled: ', title);
            Object.keys(config.issueTypeLabels).forEach(issueTypeLabel => {
                if (labels.some(label => label.name === issueTypeLabel)) {
                    labels.push({name: config.issueTypeLabels[issueTypeLabel]});
                }
            });
        }

        let normalizedTitle = getTitleWithOptionalPrefix(config, title);
        console.log('createWorkItem will create GUS work item with title: ', normalizedTitle);
        if (labels.some(label => Github.isSalesforceLabel(label.name)) && productTag) {
            console.log('Verified valid label and product tag for issue titled: ', title);
            const priority = Github.getPriority(labels);
            console.log(`Found priority: ${priority} for issue titled: ${title}`);
            const recordTypeId = Github.getRecordTypeId(labels);
            console.log(`Found recordTypeId: ${recordTypeId} for issue titled: ${title}`);
            const bodyInGusFormat = await formatToGus(html_url, body);
            console.log(`Found bodyInGusFormat: ${bodyInGusFormat} for issue titled: ${title}`);
            var useGusApi = process.env.USE_GUS_API === 'true';

            if (useGusApi) {
                console.log(`Using GUS Api to create workitem for issue titled: ${title}`);
                const buildName = milestone ? milestone.title : config.defaultBuild;
                const foundInBuild = await Gus.resolveBuild(buildName);

                const issue = await Gus.getByRelatedUrl(html_url);
                const alreadyLowestPriority =
                    issue && issue.Priority__c !== '' && issue.Priority__c <= priority;
                const recordIdTypeIsSame = issue && issue.RecordTypeId === recordTypeId;

                // if issue already exists and already has lowest priority
                // and already has correct recordTypeId then we just return
                if (alreadyLowestPriority && recordIdTypeIsSame) {
                    return;
                }

                if (foundInBuild) {
                    console.log(`Found foundInBuild: ${foundInBuild} for issue titled: ${title}`);
                    try{
                        const syncedItem = await Gus.createWorkItemInGus(normalizedTitle,
                            bodyInGusFormat,
                            productTag,
                            'NEW',
                            foundInBuild,
                            priority,
                            html_url,
                            recordTypeId);
                        const syncedItemFromGus = await Gus.getById(syncedItem.id);
                        const displayUrl = (hideWorkItemUrl === 'true') ? syncedItemFromGus.Name : `[${syncedItemFromGus.Name}](${process.env.WORK_ITEM_BASE_URL + syncedItem.id}/view)`;
                        const msg = `This issue has been linked to a new work item: ${displayUrl}`;
                        console.log(msg, ' for issue titled: ', title);
                        return await updateIssue(req, msg);
                    } catch(e) {
                        console.log(`Error while creating work item ${e.message}`);
                        return await updateIssue(req, 'Error while creating work item!');
                    }
                } else {
                    console.log(`No correct build for issue titled: ${title}`);
                    return await updateIssue(req, 'Error while creating work item. No valid build foundin GUS!');
                }
            } else {
                const foundInBuild = await Builds.resolveBuild(config, milestone);
                console.log(`Found foundInBuild: ${foundInBuild} for issue titled: ${title}`);
                if (foundInBuild) {
                    console.log('Verified valid foundInBuild: ', foundInBuild, 'for issue titled: ', title);
                    return sails.hooks['issues-hook'].queue.push(
                        {
                            name: 'CREATE_WORK_ITEM',
                            subject: normalizedTitle,
                            description: bodyInGusFormat,
                            storyDetails: bodyInGusFormat,
                            productTag,
                            status: 'NEW',
                            foundInBuild,
                            priority,
                            relatedUrl: html_url,
                            recordTypeId
                        },
                        async (error, item) => {
                            if (item) {
                                const syncedItem = await waitUntilSynced(item, {
                                    times: 5,
                                    interval: 60000
                                });
                                if (syncedItem) {
                                    const msg = `This issue has been linked to a new work item: ${getWorkItemUrl(syncedItem, hideWorkItemUrl)}`;
                                    console.log(msg, ' for issue titled: ', title);
                                    return await updateIssue(req, msg);
                                }
                                const msg = 'Sorry we could not wait until Heroku connect make the synchronization.';
                                console.log(msg);
                                return await updateIssue(req, msg);
                            }
                        }
                    );
                }
                const errorMessage = getBuildErrorMessage(config, milestone);
                console.log(`Updating issue with req: ${req} and errorMessage: ${errorMessage}`);
                return await updateIssue(req, errorMessage);
            }
        }
        console.log('Failed to create work item for issue titled: ', title);
        return null;
    }
};

