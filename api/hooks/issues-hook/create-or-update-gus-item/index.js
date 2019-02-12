const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');

module.exports = async function createOrUpdateGusItem(task) {
    const {
        subject,
        description,
        productTag,
        status,
        foundInBuild,
        priority,
        relatedUrl,
    } = task;

    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const hasLowestPriority = issue && issue.priority <= priority;

    if (!hasLowestPriority) {
        if (issue) {
            Logger.log({
                message: `Updating GUS item id:${issue} to ${priority} priority.`,
                event: {
                    update_gus_item: {
                        id: issue.id,
                        priority,
                    },
                }
            });
            return Issues.update(issue.id, { priority });
        }
        const item = {
            subject,
            description,
            productTag,
            status,
            foundInBuild,
            priority,
            relatedUrl,
        };
        Logger.log({
            message: 'Creating GUS item when issue labeled.',
            event: {
                create_gus_item: item,
            }
        });
        return Issues.create(item);
    }
};
