const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');


module.exports = async function updateGusItemDescription({ description, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
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
    Logger.log({
        type: 'error',
        message: `There isn't a GUS item related found or it wasn't created by us`,
        event: {
            context: {
                gusUserId: sails.config.gus.gusUserId,
                issue,
            }
        },
    });
    return null;
};
