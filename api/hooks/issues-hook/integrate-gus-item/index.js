const Issues = require('../../../services/Issues');

module.exports = async function integrateGusItem({ relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const isNotIntegrated = issue && issue.status !== 'INTEGRATE';
    if (isNotIntegrated) {
        console.log('update gus item status to: INTEGRATE');
        return Issues.update(issue.id, {
            status: 'INTEGRATE',
        });
    }
    return null;
};
