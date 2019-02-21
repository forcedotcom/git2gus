module.exports = async function update(id, issue) {
    return await Issues.updateOne({ id }, issue);
};
