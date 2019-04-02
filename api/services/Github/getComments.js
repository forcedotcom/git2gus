module.exports = async function getComments({ req }) {
    const {
        issue: { number },
        repository
    } = req.body;
    return await req.octokitClient.issues.listComments({
        owner: repository.owner.login,
        repo: repository.name,
        number
    });
};
