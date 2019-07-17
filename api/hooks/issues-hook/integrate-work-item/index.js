const Issues = require('../../../services/Issues');

module.exports = async function integrateWorkItem({ relatedUrl, status }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue && issue.status.toUpperCase() !== 'CLOSED') {
        return Issues.update(issue.id, {
            status
        });
    }
    return null;
};
