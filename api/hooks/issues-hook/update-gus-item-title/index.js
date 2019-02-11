const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');

module.exports = async function updateGusItemTitle({ subject, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue) {
        Logger.log({
            message: `update gus item title to: ${subject}`,
            event: {
                update_gus_item: {
                    id: issue.id,
                    subject,
                },
            }
        });
        return Issues.update(issue.id, { subject });
    }
    return null;
};
