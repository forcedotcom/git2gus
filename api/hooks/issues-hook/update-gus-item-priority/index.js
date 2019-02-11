const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');

module.exports = async function updateGusItemPriority({ priority, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const isNewPriorityGreat = issue && priority > issue.priority;
    if (priority && isNewPriorityGreat) {
        Logger.log({
            message: `update gus item to ${priority} priority when issue is unlabeled`,
            event: {
                update_gus_item: {
                    id: issue.id,
                    priority,
                },
            }
        });
        return Issues.update(issue.id, { priority });
    }
    return null;
};
