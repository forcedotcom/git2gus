const GithubEvents = require('../modules/GithubEvents');

module.exports = {
    eventName: GithubEvents.events.ISSUE_CLOSED,
    fn: async function (req) {
        const {
            issue: {
                url,
            },
        } = req.body;

        sails.hooks['issues-hook'].queue.push({
            name: 'INTEGRATE_GUS_ITEM',
            relatedUrl: url,
        });
    }
};
