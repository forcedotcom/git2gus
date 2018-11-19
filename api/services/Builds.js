module.exports = {
    async getBuildByName(name) {
        return await Builds.findOne({
            name,
        });
    }
};
