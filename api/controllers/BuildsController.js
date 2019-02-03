const Builds = require('./../services/Builds');

module.exports = {
    async getBuildByName(req, res) {
        const { name } = req.params;
        const build = await Builds.getBuildByName(name);
        return res.ok(build);
    }
};
