module.exports = async function getByName(name = '') {
    return await Issues.findOne({ name });
};
