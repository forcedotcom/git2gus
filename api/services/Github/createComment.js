module.exports = async function createComment({ req, body }) {
    const {
        repository,
        issue: {
            number,
        },
    } = req.body;
    return await req.octokitClient.issues.createComment({
        owner: repository.owner.login,
        repo: repository.name,
        number,
        body,
    });
};
