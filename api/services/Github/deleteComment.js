module.exports = async function deleteComment({ req, id }) {
    const { repository } = req.body;

    return await req.octokitClient.issues.deleteComment({
        owner: repository.owner.login,
        repo: repository.name,
        comment_id: id
    });
};
