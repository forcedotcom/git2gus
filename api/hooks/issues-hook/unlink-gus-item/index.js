const Issues = require('../../../services/Issues');

module.exports = async function unlinkGusItem({ gusItemName }) {
    const issue = await Issues.getByName(gusItemName);
    if (issue) {
        return Issues.update(issue.id, {
            relatedUrl: null
        });
    }
    return null;
};
