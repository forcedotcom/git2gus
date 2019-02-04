const GithubEvents = require('../modules/GithubEvents');
const Github =  require('../services/Github');
const Issues = require('../services/Issues');

function updateIssue(issue, priority) {
    if (issue && priority > issue.priority) {
        Issues.update(issue.id, { priority });
    }
}

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
            const issue = await Issues.getByRelatedUrl(url);
            return updateIssue(issue, priority);
        }
    }
};
