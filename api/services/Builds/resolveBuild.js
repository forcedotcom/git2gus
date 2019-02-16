const getBuildByName = require('./getBuildByName');

module.exports = async function resolveBuild(config, milestone) {
    const build = milestone ? milestone.title : config.defaultBuild;
    const buildFromDb = await getBuildByName(build);
    if (buildFromDb) {
        return buildFromDb.sfid;
    }
    return null;
};
