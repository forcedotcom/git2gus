const GithubEvents = require('../modules/GithubEvents');
const { createComment, addLabels } = require('../services/Github');
const getGusItemUrl = require('../services/Issues/getGusItemUrl');
const { getAnnotation, isSameAnnotation } = require('../services/Issues');

module.exports = {
    eventName: [
        GithubEvents.events.ISSUE_OPENED,
        GithubEvents.events.ISSUE_EDITED
    ],
    fn: async function(req) {
        const {
            action,
            issue: { url, body: description },
            changes
        } = req.body;

        if (action === 'edited' && !changes.body) {
            return;
        }

        const prevDescription = changes && changes.body.from;
        const annotation = getAnnotation(description);
        if (annotation && !isSameAnnotation(prevDescription, description)) {
            sails.hooks['issues-hook'].queue.push(
                {
                    name: 'LINK_TO_WORK_ITEM',
                    relatedUrl: url,
                    gusItemName: annotation
                },
                async (error, item) => {
                    if (item) {
                        if (
                            item.recordTypeId ===
                            sails.config.gus.userStoryRecordTypeId
                        ) {
                            await addLabels({
                                req,
                                labels: [sails.config.ghLabels.storyLabel]
                            });
                        } else if (item.priority) {
                            await addLabels({
                                req,
                                labels: [`BUG ${item.priority}`]
                            });
                        }

                        return await createComment({
                            req,
                            body: `This issue has been linked to a new work item: ${getGusItemUrl(
                                item
                            )}`
                        });
                    }
                }
            );
        }
    }
};
