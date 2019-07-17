const GithubEvents = require('../modules/GithubEvents');
const { getAnnotation, isSameAnnotation } = require('../services/Issues');
const { deleteLinkedComment } = require('../services/Git2Gus');

module.exports = {
    eventName: GithubEvents.events.ISSUE_EDITED,
    fn: async function(req) {
        const {
            issue: { body: description },
            changes
        } = req.body;
        const prevDescription = changes.body && changes.body.from;
        const prevAnnotation = getAnnotation(prevDescription);

        if (prevAnnotation && !isSameAnnotation(prevDescription, description)) {
            sails.hooks['issues-hook'].queue.push(
                {
                    name: 'UNLINK_GUS_ITEM',
                    gusItemName: prevAnnotation
                },
                async (error, item) => {
                    if (item) {
                        return await deleteLinkedComment({
                            req,
                            sfid: item.sfid
                        });
                    }
                }
            );
        }
    }
};
