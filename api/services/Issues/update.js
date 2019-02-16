module.exports = async function update(id, issue) {
    return await Issues.update({ id }, issue).fetch();
};
