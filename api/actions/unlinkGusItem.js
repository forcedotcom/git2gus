const GithubEvents = require('../modules/GithubEvents');

module.exports = {
    eventName: GithubEvents.events.ISSUE_EDITED,
    fn: async function (req) {
        const {
            changes,
        } = req.body;

        if (changes.body && typeof changes.body.from === 'string') {
            const prevDescription = changes.body.from;
            const matches = prevDescription.match(/@w-\d+@/ig);
            if (Array.isArray(matches) && matches.length > 0) {
                sails.hooks['issues-hook'].queue.push({
                    name: 'UNLINK_GUS_ITEM',
                    gusItemName: matches[0].replace(/@/g, ''),
                });
            }
        }
    }
};
