const Issues = require('../../../services/Issues');

module.exports = async function updateGusItem({priority, relatedUrl}) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const isNewPriorityGreat = issue && priority > issue.priority;
    if (priority && isNewPriorityGreat) {
        console.log(`update gus item to ${priority} priority when issue is unlabeled`);
        Issues.update(issue.id, { priority });
    }
};
