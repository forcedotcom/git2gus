const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');

module.exports = async function integrateGusItem({ relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const isNotIntegrated = issue && issue.status !== 'INTEGRATE';
    if (isNotIntegrated) {
        Logger.log({
            message: 'update gus item status to: INTEGRATE',
            event: {
                update_gus_item: {
                    id: issue.id,
                    status: 'INTEGRATE',
                },
            }
        });
        return Issues.update(issue.id, {
            status: 'INTEGRATE',
        });
    }
    return null;
};
