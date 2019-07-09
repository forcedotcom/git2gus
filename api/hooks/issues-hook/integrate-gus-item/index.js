const Issues = require('../../../services/Issues');

module.exports = async function integrateGusItem({ relatedUrl, status }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue && issue.status !== 'CLOSED') {
        return Issues.update(issue.id, {
            status
        });
    }
    return null;
};
