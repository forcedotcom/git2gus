// @ts-check
const Issues = require('../../../services/Issues');

/**
 * Updates comment in GUS item if matching URL found, otherwise adds new comment
 * to the GUS item's comments
 *
 * @param {{relatedUrl: string, comment: {url: string, body: string}}} task
 * @returns
 */
async function deleteGusItemComment({ relatedUrl, comment }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue) {
        let comments = issue.comments;
        if (comments) {
            comments = comments.filter(
                /**
                 * @param {{ url: string; }} el
                 */
                el => {
                    el.url !== comment.url;
                }
            );
            return Issues.update(issue.id, { comments });
        }
    }
    return null;
}

module.exports = deleteGusItemComment;
