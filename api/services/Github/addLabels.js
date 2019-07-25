const shouldUsePersonalToken = require('../../services/Github/shouldUsePersonalToken');

module.exports = async function addLabels({ req, labels }) {
    const {
        issue: { number },
        repository
    } = req.body;
    if (shouldUsePersonalToken(repository.url)) {
        return await req.octokitTokenClient.issues.addLabels({
            owner: repository.owner.login,
            repo: repository.name,
            number,
            labels
        });
    }
    return await req.octokitClient.issues.addLabels({
        owner: repository.owner.login,
        repo: repository.name,
        number,
        labels
    });
};
