const GithubEvents = require('../modules/GithubEvents');

module.exports = {
    eventName: GithubEvents.events.ISSUE_EDITED,
    fn: async function(req) {
        const {
            changes,
            issue: { title, url }
        } = req.body;
        const isTitleEdited = !!changes.title;

        if (isTitleEdited) {
            sails.hooks['issues-hook'].queue.push({
                name: 'UPDATE_WORK_ITEM_TITLE',
                subject: title,
                relatedUrl: url
            });
        }
    }
};
