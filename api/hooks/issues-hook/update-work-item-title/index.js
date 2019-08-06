const Issues = require('../../../services/Issues');

module.exports = async function updateWorkItemTitle({ subject, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue && Issues.weCreateIssue(issue)) {
        return Issues.update(issue.id, { subject });
    }
    return null;
};