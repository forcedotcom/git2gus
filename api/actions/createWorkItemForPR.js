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

module.exports = {
    eventName: GithubEvents.events.PULL_REQUEST_LABELED,
    fn: async function (req) {
        console.log('createWorkItem Action called with req: ', req);
        const {
            pull_request: { labels, html_url, body, milestone }
        } = req.body;
        let {
            pull_request: { title }
        } = req.body;
        // Only grab the label being added for comparison against Salesforce labels
        const { label : labelAdded } = req.body;
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
                // If the label added is a Salesforce custom label, give it the correct base label
                if (labelAdded.name === issueTypeLabel) {
                    labelAdded.name = config.issueTypeLabels[issueTypeLabel];
                }
                if (labels.some(label => label.name === issueTypeLabel)) {
                    labels.push({name: config.issueTypeLabels[issueTypeLabel]});
                }
            });
        }

        let normalizedTitle = getTitleWithOptionalPrefix(config, title);
        console.log('createWorkItem will create GUS work item with title: ', normalizedTitle);
        // Only check the label being added
        if (Github.isSalesforceLabel(labelAdded.name) && productTag) {
            console.log('Verified valid label and product tag for issue titled: ', title);
            const priority = Github.getPriority(labels);
            console.log(`Found priority: ${priority} for issue titled: ${title}`);
            const recordTypeId = Github.getRecordTypeId(labels);
            console.log(`Found recordTypeId: ${recordTypeId} for issue titled: ${title}`);
            const bodyInGusFormat = await formatToGus(html_url, body);
            console.log(`Found bodyInGusFormat: ${bodyInGusFormat} for issue titled: ${title}`);

            console.log(`Using GUS Api to create workitem for issue titled: ${title}`);
            const buildName = milestone ? milestone.title : config.defaultBuild;
            const foundInBuild = await Gus.resolveBuild(buildName);
            console.log(`Found foundInBuild: ${foundInBuild} for issue titled: ${title}`);

            const issue = await Gus.getByRelatedUrl(html_url);
            const bugRecordTypeId = Gus.getBugRecordTypeId();

            const alreadyLowestPriority =
                issue && issue.Priority__c !== '' && issue.Priority__c <= priority;
            const recordIdTypeIsSame = issue && issue.RecordTypeId === recordTypeId;
            const isRecordTypeBug = recordTypeId === bugRecordTypeId;

            // If issue is a bug we check if it already exists and already has lowest priority
            // If issue type is investigation or story, we simply check it exists
            if (isRecordTypeBug && alreadyLowestPriority && recordIdTypeIsSame) {
                return;
            } else if ( !isRecordTypeBug && recordIdTypeIsSame) {
                return;
            }

            if (foundInBuild) {
                try{
                    console.log('Calling GUS API to create a new work item');
                    const syncedItem = await Gus.createWorkItemInGus(normalizedTitle,
                        bodyInGusFormat,
                        productTag,
                        'NEW',
                        foundInBuild,
                        priority,
                        html_url,
                        recordTypeId);
                    const syncedItemFromGus = await Gus.getById(syncedItem.id);
                    console.log('###hideWorkItemUrl:' + hideWorkItemUrl);
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
                return await updateIssue(req, 'Error while creating work item. No valid build found in GUS!');
            }
        }
        console.log('Failed to create work item for issue titled: ', title);
        return null;
    }
};
