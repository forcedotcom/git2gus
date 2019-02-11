const GithubEvents = require('../modules/GithubEvents');
const Logger = require('../services/Logger');

module.exports = {
    eventName: GithubEvents.events.ISSUE_EDITED,
    fn: async function (req) {
        const {
            changes,
            issue: {
                title,
                url,
            },
        } = req.body;
        const isTitleEdited = !!changes.title;
        Logger.log({ message: `handling ${GithubEvents.events.ISSUE_EDITED} event` });

        if (isTitleEdited) {
            sails.hooks['issues-hook'].queue.push({
                name: 'UPDATE_GUS_ITEM_TITLE',
                subject: title,
                relatedUrl: url,
            }, () => Logger.log({ message: 'done updateGusItemTitle action' }));
        }
    }
};
