module.exports = {
    async getBuildByName(name) {
        return await Builds.findOne({
            name,
        });
    },
    async resolveBuild(config, milestone) {
        const build = milestone ? milestone.title : config.defaultBuild;
        const buildFromDb = await this.getBuildByName(build);
        if (buildFromDb) {
            return buildFromDb.sfid;
        }
        return null;
    }
};
