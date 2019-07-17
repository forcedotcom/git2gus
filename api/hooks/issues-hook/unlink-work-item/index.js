const Issues = require('../../../services/Issues');

module.exports = async function unlinkWorkItem({ workItemName }) {
    const issue = await Issues.getByName(workItemName);
    if (issue) {
        return Issues.update(issue.id, {
            relatedUrl: null
        });
    }
    return null;
};
