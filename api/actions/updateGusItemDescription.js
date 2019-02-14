const GithubEvents = require('../modules/GithubEvents');

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

        if (isDescriptionEdited) {
            sails.hooks['issues-hook'].queue.push({
                name: 'UPDATE_GUS_ITEM_DESCRIPTION',
                description: body,
                relatedUrl: url,
            });
        }
    }
};
