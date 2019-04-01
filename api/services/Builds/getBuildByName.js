module.exports = async function getBuildByName(name) {
    return await Builds.findOne({
        name
    });
};
