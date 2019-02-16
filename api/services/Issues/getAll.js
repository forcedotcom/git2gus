module.exports =  async function getAll() {
    return await Issues.find({}).limit(25);
};
