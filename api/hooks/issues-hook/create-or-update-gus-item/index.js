const Issues = require('../../../services/Issues');

module.exports = async function createOrUpdateGusItem(task) {
    const {
        subject,
        description,
        productTag,
        status,
        foundInBuild,
        priority,
        relatedUrl
    } = task;

    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const hasLowestPriority = issue && issue.priority <= priority;

    if (!hasLowestPriority) {
        if (issue) {
            return await Issues.update(issue.id, { priority });
        }
        const item = {
            subject,
            description,
            productTag,
            status,
            foundInBuild,
            priority,
            relatedUrl
        };
        return await Issues.create(item);
    }
};
