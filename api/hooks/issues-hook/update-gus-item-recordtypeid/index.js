// @ts-check
const Issues = require('../../../services/Issues');

/**
 * Update a GUS work item's RecordTypeId. If the work item already has the given
 * RecordTypeId then the work item will not be updated.
 *
 * @param {{recordTypeId: string, relatedUrl: string}} task
 * @returns
 */
async function updateGusItemRecordTypeId({ recordTypeId, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const newRecordTypeId = issue && issue.recordTypeId !== recordTypeId;
    if (newRecordTypeId) {
        return Issues.update(issue.id, { recordTypeId });
    }
    return null;
}

module.exports = updateGusItemRecordTypeId;
