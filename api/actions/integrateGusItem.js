const GithubEvents = require('../modules/GithubEvents');
const { isGusItemClosed } = require('../services/Git2Gus');

function getStatus(statusWhenClosed) {
    if (statusWhenClosed && isGusItemClosed(statusWhenClosed)) {
        return statusWhenClosed;
    }
    return 'INTEGRATED';
}

module.exports = {
    eventName: GithubEvents.events.ISSUE_CLOSED,
    fn: async function(req) {
        const {
            issue: { url }
        } = req.body;
        const { statusWhenClosed } = req.git2gus.config;

        sails.hooks['issues-hook'].queue.push({
            name: 'INTEGRATE_GUS_ITEM',
            relatedUrl: url,
            status: getStatus(statusWhenClosed)
        });
    }
};
