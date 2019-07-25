const shouldUsePersonalToken = require('../../services/Github/shouldUsePersonalToken');

module.exports = async function deleteComment({ req, id }) {
    const { repository } = req.body;

    const githubClient = shouldUsePersonalToken(repository.url)
        ? req.octokitTokenClient
        : req.octokitClient;

    return await githubClient.issues.deleteComment({
        owner: repository.owner.login,
        repo: repository.name,
        comment_id: id
    });
};
