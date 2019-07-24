const {
    shouldUsePersonalToken
} = require('../../services/Github/shouldUsePersonalToken');

module.exports = async function getComments({ req }) {
    const {
        issue: { number },
        repository
    } = req.body;

    if (shouldUsePersonalToken(repository.issue.url)) {
        return await req.octokitTokenClient.issues.listComments({
            owner: repository.owner.login,
            repo: repository.name,
            number
        });
    }
    return await req.octokitClient.issues.listComments({
        owner: repository.owner.login,
        repo: repository.name,
        number
    });
};
