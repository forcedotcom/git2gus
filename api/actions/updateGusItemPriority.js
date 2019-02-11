const GithubEvents = require('../modules/GithubEvents');
const Github =  require('../services/Github');
const Logger = require('../services/Logger');

module.exports = {
    eventName: GithubEvents.events.ISSUE_UNLABELED,
    fn: async function (req) {
        const {
            issue: {
                labels,
                url,
            },
            label,
        } = req.body;
        Logger.log({ message: `handling ${GithubEvents.events.ISSUE_UNLABELED} event` });

        if (label && Github.isGusLabel(label.name)) {
            const priority = Github.getPriority(labels);
            sails.hooks['issues-hook'].queue.push({
                name: 'UPDATE_GUS_ITEM_PRIORITY',
                priority,
                relatedUrl: url,
            }, () => Logger.log({ message: 'done updateGusItemPriority action' }));
        }
    }
};
