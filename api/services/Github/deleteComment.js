const {
    shouldUsePersonalToken
} = require('../../services/Github/shouldUsePersonalToken');

module.exports = async function deleteComment({ req, id }) {
    const { repository } = req.body;

    if (shouldUsePersonalToken(repository.issue.url)) {
        return await req.octokitTokenClient.issues.deleteComment({
            owner: repository.owner.login,
            repo: repository.name,
            comment_id: id
        });
    }
    return await req.octokitClient.issues.deleteComment({
        owner: repository.owner.login,
        repo: repository.name,
        comment_id: id
    });
};
