module.exports = async function getById(id) {
    return await Issues.findOne({ id });
};
