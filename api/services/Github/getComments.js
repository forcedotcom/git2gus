const shouldUsePersonalToken = require('../../services/Github/shouldUsePersonalToken');

module.exports = async function getComments({ req }) {
    const {
        issue: { number },
        repository
    } = req.body;

    const githubClient = shouldUsePersonalToken(repository.url)
        ? req.octokitTokenClient
        : req.octokitClient;

    return await githubClient.issues.listComments({
        owner: repository.owner.login,
        repo: repository.name,
        number
    });
};
