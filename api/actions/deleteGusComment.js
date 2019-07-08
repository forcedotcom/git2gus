const GithubEvents = require('../modules/GithubEvents');
const Builds = require('../services/Builds');
const Github = require('../services/Github');
const { ghLabels } = require('../../config/ghLabels');
const { waitUntilSynced } = require('../services/Issues');

module.exports = {
    eventName: [GithubEvents.events.ISSUE_COMMENT_DELETED],
    fn: async function(req) {
        const {
            issue: { labels, milestone },
            comment: { url, issue_url, body }
        } = req.body;
        const { config } = req.git2gus;

        if (
            labels.some(
                l =>
                    Github.isGusLabel(l.name) &&
                    l.name === ghLabels.commentSyncLabel
            )
        ) {
            const foundInBuild = await Builds.resolveBuild(config, milestone);
            if (foundInBuild) {
                return sails.hooks['issues-hook'].queue.push(
                    {
                        name: 'DELETE_GUS_ITEM_COMMENT',
                        relatedUrl: issue_url,
                        comment: {
                            url,
                            body
                        }
                    },
                    async (error, item) => {
                        if (item) {
                            const syncedItem = await waitUntilSynced(item, {
                                times: 5,
                                interval: 60000
                            });
                            if (syncedItem) {
                                return;
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
        }
        return null;
    }
};
