const Issues = require('../../../services/Issues');

module.exports = async function updateGusItemDescription({
    description,
    relatedUrl
}) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue && Issues.weCreateIssue(issue)) {
        return Issues.update(issue.id, { description });
    }
    return null;
};
