// @ts-check
const Issues = require('../../../services/Issues');

/**
 *
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
