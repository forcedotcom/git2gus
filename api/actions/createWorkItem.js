const GithubEvents = require('../modules/GithubEvents');
const Builds = require('../services/Builds');
const Github = require('../services/Github');
const { getWorkItemUrl, waitUntilSynced } = require('../services/Issues');
const Logger = require('../services/Logger');

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

        Logger.log("Issue Labeled")

        let productTag = config.productTag;
        if (config.productTagLabels) {
            Logger.log("Checking product tag labels")
            Object.keys(config.productTagLabels).forEach(productTagLabel => {
                if (labels.some(label => label.name === productTagLabel)) {
                    productTag = config.productTagLabels[productTagLabel];
                }
            });
        }

        if (Github.isSalesforceLabel(label.name) && productTag) {
            Logger.log("Is Salesforce label")
            const priority = Github.getPriority(labels);
            Logger.log("Got priority " + priority)
            const recordTypeId = Github.getRecordTypeId(labels);
            Logger.log("Got record type id " + recordTypeId)
            const foundInBuild = await Builds.resolveBuild(config, milestone);
            Logger.log("Got build... " + foundInBuild)
            if (foundInBuild) {
                Logger.log("Calling creation hook")
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
