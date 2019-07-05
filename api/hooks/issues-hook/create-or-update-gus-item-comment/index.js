// @ts-check
const Issues = require('../../../services/Issues');

/**
 * Updates comment in GUS item if matching URL found, otherwise adds new comment
 * to the GUS item's comments
 *
 * @param {{relatedUrl: string, comment: {url: string, body: string}}} task
 * @returns
 */
async function createGusItemComment({ relatedUrl, comment }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue) {
        const comments = issue.comments ? issue.comments : [];
        const matchingComment = comments.find(
            /**
             * @param {{ url: string; }} c
             */
            c => c.url === comment.url
        );
        if (matchingComment) {
            matchingComment.body = comment.body;
        } else {
            comments.push(comment);
        }
        return Issues.update(issue.id, { comments });
    }
    return null;
}

module.exports = createGusItemComment;
