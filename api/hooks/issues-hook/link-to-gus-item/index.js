const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');

module.exports = async function linkToGusItem(task) {
    const {
        relatedUrl,
        gusItemName,
    } = task;
    const issue = await Issues.getByName(gusItemName);
    if (issue) {
        Logger.log({
            message: `GUS Item ${gusItemName} found. Linking...`,
            event: {
                issue_and_gus_item_linked: {
                    issue: relatedUrl,
                    gusItem: {
                        name: gusItemName,
                        id: issue.id,
                    },
                },
            },
        });
        return Issues.update(issue.id, { relatedUrl });
    }
    Logger.log({
        type: 'error',
        message: `There isn't any GUS item with name ${gusItemName}`,
    });
    return null;
};
