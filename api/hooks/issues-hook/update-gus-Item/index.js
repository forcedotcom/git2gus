const Issues = require('../../../services/Issues');

module.exports = async function updateGusItem({priority, relatedUrl}) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const isNewPriorityGreat = issue && priority > issue.priority;
    if (isNewPriorityGreat) {
        console.log('update gus item when issue unlabeled');
        Issues.update(issue.id, { priority });
    }
};
