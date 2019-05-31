const GithubEvents = require('../modules/GithubEvents');
const Github = require('../services/Github');

module.exports = {
    eventName: GithubEvents.events.ISSUE_UNLABELED,
    fn: async function(req) {
        const {
            issue: { labels, url },
            label
        } = req.body;

        if (label && Github.isGusLabel(label.name)) {
            const priority = Github.getPriority(labels);
            sails.hooks['issues-hook'].queue.push({
                name: 'UPDATE_GUS_ITEM_PRIORITY',
                priority,
                relatedUrl: url
            });
        }

        // TODO - wes - you might need to change record type id
        // if you removed a story label and there is still a bug
        // label on the issue - need an issue hook for UPDATE_GUS_RECORDTYPEID
    }
};
