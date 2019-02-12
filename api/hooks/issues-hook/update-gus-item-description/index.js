const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');


module.exports = async function updateGusItemDescription({ description, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    // We shouldn't change/update items we didn't created
    if (issue && Issues.weCreateIssue(issue)) {
        Logger.log({
            message: `Updating GUS item description to: ${description}`,
            event: {
                update_gus_item: {
                    id: issue.id,
                    description,
                },
            }
        });
        return Issues.update(issue.id, { description });
    }
    return null;
};
