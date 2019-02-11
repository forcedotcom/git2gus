const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');

module.exports = async function updateGusItemDescription({ description, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue) {
        Logger.log({
            message: `update gus item description to: ${description}`,
            event: {
                update_gus_item: {
                    id: issue.id,
                    description,
                },
            }
        });
        return Issues.update(issue.id, { description });
    }
    return null;
};
