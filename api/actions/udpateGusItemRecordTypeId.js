// @ts-check
const GithubEvents = require('../modules/GithubEvents');
const Github = require('../services/Github');

/**
 * @typedef {global & {sails: any}} TypedGlobal
 * @typedef {import("@octokit/rest").IssuesGetEventResponseIssueLabelsItem} Label
 */

module.exports = {
    eventName: GithubEvents.events.ISSUE_UNLABELED,
    fn: async function(req) {
        const {
            issue: { labels, url }
        } = req.body;

        /**@type{Label}*/
        const label = req.body.label;

        if (label && Github.isGusLabel(label.name)) {
            const recordTypeId = Github.getRecordTypeId(labels);
            /**@type{TypedGlobal} */ (global).sails.hooks[
                'issues-hook'
            ].queue.push({
                name: 'UPDATE_GUS_ITEM_RECORDTYPEID',
                recordTypeId,
                relatedUrl: url
            });
        }
    }
};
