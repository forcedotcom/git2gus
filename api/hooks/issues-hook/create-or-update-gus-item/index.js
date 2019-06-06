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
    const currentIssueHasLowestPriority =
        issue && issue.priority !== '' && issue.priority <= priority;
    const currentIssueRecordTypeIdIsSame =
        issue && issue.recordTypeId === recordTypeId;

    if (!currentIssueHasLowestPriority || !currentIssueRecordTypeIdIsSame) {
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
