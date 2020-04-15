/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const GithubEvents = require('../modules/GithubEvents');
const Builds = require('../services/Builds');
const Github = require('../services/Github');
const { getWorkItemUrl, waitUntilSynced } = require('../services/Issues');
const remark = require('remark');
const strip = require('strip-markdown');
const markdown = require('remark-parse');


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
        const {
            issue: { labels, url, body, milestone }
        } = req.body;
        var {
            issue: { title }
        } = req.body;
        const { config } = req.git2gus;
        const { hideWorkItemUrl } = config;
        const { updateIssueDescription } = config;
        let productTag = config.productTag;
        if (config.productTagLabels) {
            Object.keys(config.productTagLabels).forEach(productTagLabel => {
                if (labels.some(label => label.name === productTagLabel)) {
                    productTag = config.productTagLabels[productTagLabel];
                }
            });
        }
        if(config.issueTypeLabels) {
            Object.keys(config.issueTypeLabels).forEach(issueTypeLabel => {
                if (labels.some(label => label.name === issueTypeLabel)) {
                    labels.push({name: config.issueTypeLabels[issueTypeLabel]});
                }
            });
        }
        if (config.gusTitlePrefix) {
            title = config.gusTitlePrefix.concat(' ', title);
        }
        if (labels.some(label => Github.isSalesforceLabel(label.name)) && productTag) {
            const priority = Github.getPriority(labels);
            const recordTypeId = Github.getRecordTypeId(labels);
            const foundInBuild = await Builds.resolveBuild(config, milestone);
            const bodyInGusFormat = await formatToGus(url, body);
            if (foundInBuild) {
                return sails.hooks['issues-hook'].queue.push(
                    {
                        name: 'CREATE_WORK_ITEM',
                        subject: title,
                        description: bodyInGusFormat,
                        storyDetails: bodyInGusFormat,
                        productTag,
                        status: 'NEW',
                        foundInBuild,
                        priority,
                        relatedUrl: url,
                        recordTypeId
                    },
                    async (error, item) => {
                        if (item) {
                            const syncedItem = await waitUntilSynced(item, {
                                times: 5,
                                interval: 60000
                            });
                            if (syncedItem) {
                                return await updateIssue(req, `This issue has been linked to a new work item: ${getWorkItemUrl(syncedItem, hideWorkItemUrl)}`, updateIssueDescription);
                            }
                            return await updateIssue(req, 'Sorry we could wait until Heroku connect make the synchronization.', updateIssueDescription);
                        }
                    }
                );
            }
            return await updateIssue(req, getBuildErrorMessage(config, milestone, updateIssueDescription));
        }
        return null;
    }
};
function formatToGus(url, body) {
    var formattedDescription;
    remark().use(markdown).use(strip).process(body, (err, file) => {
        if (err) {
            throw err;
        }
        formattedDescription = 'Github issue link: '.concat(url, '\n', String(file));
    });
    return formattedDescription;
}

async function updateIssue(req, body, updateIssueDescription) {
    if (updateIssueDescription) {
        return await Github.updateDescription({
            req,
            body
        });
    }
    return await Github.createComment({
        req,
        body
    });
}

