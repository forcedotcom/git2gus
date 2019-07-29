const Issues = require('../../../services/Issues');

module.exports = async function linkToWorkItem(task) {
    const { relatedUrl, workItemName } = task;
    const issue = await Issues.getByName(workItemName);

    if (issue) {
        return Issues.update(issue.id, { relatedUrl });
    }
    return null;
};
