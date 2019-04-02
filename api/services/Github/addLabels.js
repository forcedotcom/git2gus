module.exports = async function addLabels({ req, labels }) {
    const {
        issue: { number },
        repository
    } = req.body;
    return await req.octokitClient.issues.addLabels({
        owner: repository.owner.login,
        repo: repository.name,
        number,
        labels
    });
};
