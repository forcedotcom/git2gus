const GithubEvents = require('../modules/GithubEvents');
const Builds = require('../services/Builds');
const Github = require('../services/Github');
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
    fn: async function(req) {
        const {
            issue: { labels, url, title, body, milestone },
            label
        } = req.body;
        const { config } = req.git2gus;

        let productTag = config.productTag;
        if (config.productTagLabels) {
            Object.keys(config.productTagLabels).forEach(productTagLabel => {
                if (labels.some(label => label.name === productTagLabel)) {
                    productTag = config.productTagLabels[productTagLabel];
                }
            });
        }

        if (Github.isSalesforceLabel(label.name) && productTag) {
            const priority = Github.getPriority(labels);
            const recordTypeId = Github.getRecordTypeId(labels);
            const foundInBuild = await Builds.resolveBuild(config, milestone);
            if (foundInBuild) {
                return sails.hooks['issues-hook'].queue.push(
                    {
                        name: 'CREATE_WORK_ITEM',
                        subject: title,
                        description: body,
                        storyDetails: body,
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
                                return await Github.createComment({
                                    req,
                                    body: `This issue has been linked to a new work item: ${getWorkItemUrl(
                                        syncedItem
                                    )}`
                                });
                            }
                            return await Github.createComment({
                                req,
                                body:
                                    'Sorry we could wait until Heroku connect make the syncronization.'
                            });
                        }
                    }
                );
            }
            return await Github.createComment({
                req,
                body: getBuildErrorMessage(config, milestone)
            });
        }
        return null;
    }
};
