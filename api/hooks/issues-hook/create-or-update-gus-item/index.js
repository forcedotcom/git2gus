const Issues = require('../../../services/Issues');

module.exports = async function createOrUpdateGusItem(task) {
    const {
        subject,
        description,
        productTag,
        status,
        foundInBuild,
        priority,
        relatedUrl,
        recordTypeId
    } = task;

    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const hasLowestPriority = issue && issue.priority <= priority;

    // TODO: wes - need to check if recordTypeId changed and if so update the
    // Issue

    if (!hasLowestPriority) {
        if (issue) {
            return await Issues.update(issue.id, { priority, recordTypeId });
        }
        const item = {
            subject,
            description,
            productTag,
            status,
            foundInBuild,
            priority,
            relatedUrl,
            recordTypeId
        };
        return await Issues.create(item);
    }
};
