module.exports = function getMatchedComments(comments = [], sfid) {
    return comments.filter((comment) => {
        const matches = comment.body.split('/');
        if (Array.isArray(matches) && matches.length > 0) {
            return matches[6] === sfid;
        }
        return false;
    });
};
