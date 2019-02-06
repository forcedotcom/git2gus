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
    } = task;

    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const hasLowestPriority = issue && issue.priority <= priority;

    if (!hasLowestPriority) {
        if (issue) {
            console.log(`update gus item to ${priority} priority when issue is labeled`);
            Issues.update(issue.id, { priority });
        } else {
            console.log('create gus item when issue labeled');
            Issues.create({
                subject,
                description,
                productTag,
                status,
                foundInBuild,
                priority,
                relatedUrl,
            });
        }
    }
};
