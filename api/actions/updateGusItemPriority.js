const GithubEvents = require('../modules/GithubEvents');
const Github = require('../services/Github');

module.exports = {
    eventName: GithubEvents.events.ISSUE_UNLABELED,
    fn: async function(req) {
        const {
            issue: { labels, url },
            label
        } = req.body;

        if (label && Github.isGusBugLabel(label.name)) {
            const priority = Github.getPriority(labels);
            sails.hooks['issues-hook'].queue.push({
                name: 'UPDATE_GUS_ITEM_PRIORITY',
                priority,
                relatedUrl: url
            });
        }
    }
};
