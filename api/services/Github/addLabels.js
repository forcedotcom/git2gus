const shouldUsePersonalToken = require('../../services/Github/shouldUsePersonalToken');

module.exports = async function addLabels({ req, labels }) {
    const {
        issue: { number },
        repository
    } = req.body;

    const githubClient = shouldUsePersonalToken(repository.url)
        ? req.octokitTokenClient
        : req.octokitClient;

    return await githubClient.issues.addLabels({
        owner: repository.owner.login,
        repo: repository.name,
        number,
        labels
    });
};
