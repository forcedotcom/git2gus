const GithubEvents = require('../modules/GithubEvents');
const Github =  require('../services/Github');

module.exports = {
    eventName: GithubEvents.events.ISSUE_UNLABELED,
    fn: async function (req) {
        const {
            issue: {
                labels,
                url,
            },
            label: { name },
        } = req.body;

        if (Github.isGusLabel(name)) {
            const priority = Github.getPriority(labels);
            sails.hooks['issues-hook'].queue.push({
                name: 'update gus item',
                priority,
                relatedUrl: url,
            }, () => console.log('done updateGusItem action'));
        }
    }
};
