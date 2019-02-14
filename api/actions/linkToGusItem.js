const GithubEvents = require('../modules/GithubEvents');

module.exports = {
    eventName: [
        GithubEvents.events.ISSUE_OPENED,
        GithubEvents.events.ISSUE_EDITED,
    ],
    fn: async function (req) {
        const {
            action,
            issue: {
                url,
                body: description,
            },
            changes,
        } = req.body;

        if (action === 'edited' && !changes.body) {
            return;
        }

        if (typeof description === 'string') {
            const matches = description.match(/@w-\d+@/ig);
            if (Array.isArray(matches) && matches.length > 0) {
                sails.hooks['issues-hook'].queue.push({
                    name: 'LINK_TO_GUS_ITEM',
                    relatedUrl: url,
                    gusItemName: matches[0].replace(/@/g, ''),
                });
            }
        }
    }
};
