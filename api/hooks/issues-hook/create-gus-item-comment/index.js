// @ts-check
const Issues = require('../../../services/Issues');

/**
 * Adds a comment to a GUS item
 *
 * @param {{relatedUrl: string, comment: {url: string, body: string}}} task
 * @returns
 */
async function createGusItemComment({ relatedUrl, comment }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue) {
        const comments = issue.comments ? issue.comments : [];
        comments.push(comment);
        return Issues.update(issue.id, { comments });
    }
    return null;
}

module.exports = createGusItemComment;
