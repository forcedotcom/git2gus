const GithubEvents = require('../modules/GithubEvents');
const Logger = require('../services/Logger');

module.exports = {
    eventName: GithubEvents.events.ISSUE_CLOSED,
    fn: async function (req) {
        const {
            issue: {
                url,
            },
        } = req.body;
        Logger.log({ message: `handling ${GithubEvents.events.ISSUE_CLOSED} event` });

        sails.hooks['issues-hook'].queue.push({
            name: 'INTEGRATE_GUS_ITEM',
            relatedUrl: url,
        }, () => Logger.log({ message: 'done integrateGusItem action' }));
    }
};
