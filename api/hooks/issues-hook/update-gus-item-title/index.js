const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');

module.exports = async function updateGusItemTitle({ subject, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue && Issues.weCreateIssue(issue)) {
        Logger.log({
            message: `Updating GUS item title to: ${subject}`,
            event: {
                update_gus_item: {
                    id: issue.id,
                    subject,
                },
            }
        });
        return Issues.update(issue.id, { subject });
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
