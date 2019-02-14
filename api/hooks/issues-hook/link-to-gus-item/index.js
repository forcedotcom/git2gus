const Issues = require('../../../services/Issues');

module.exports = async function linkToGusItem(task) {
    const {
        relatedUrl,
        gusItemName,
    } = task;
    const issue = await Issues.getByName(gusItemName);

    if (issue) {
        return Issues.update(issue.id, { relatedUrl });
    }
    return null;
};
