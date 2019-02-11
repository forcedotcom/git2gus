const GithubEvents = require('../modules/GithubEvents');
const Logger = require('../services/Logger');

module.exports = {
    eventName: GithubEvents.events.ISSUE_EDITED,
    fn: async function (req) {
        const {
            changes,
            issue: {
                body,
                url,
            },
        } = req.body;
        const isDescriptionEdited = !!changes.body;
        Logger.log({ message: `handling ${GithubEvents.events.ISSUE_EDITED} event` });

        if (isDescriptionEdited) {
            sails.hooks['issues-hook'].queue.push({
                name: 'UPDATE_GUS_ITEM_DESCRIPTION',
                description: body,
                relatedUrl: url,
            }, () => Logger.log({ message: 'done updateGusItemDescription action' }));
        }
    }
};
