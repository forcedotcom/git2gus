const Issues = require('../../../services/Issues');

module.exports = async function updateGusItemPriority({ priority, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const isNewPriorityGreat = issue && priority > issue.priority;
    if (priority && isNewPriorityGreat) {
        return Issues.update(issue.id, { priority });
    }
    return null;
};
