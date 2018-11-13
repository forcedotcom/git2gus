const Github = require('./../services/Github');

module.exports = async function hasConfig(req, res, next) {
    const {
        action,
        repository,
    } = req.body;
    const event = req.headers['x-github-event'];

    if ((event === 'issues' || event === 'pull_request') && action === 'opened') {
        const params = {
            owner: repository.owner.login,
            repo: repository.name,
        };
        const number = req.body.number || req.body.issue.number;

        try {
            const config = await Github.getConfig({
                ...params,
                octokitClient: req.octokitClient,
            });
            req.git2gus = Object.assign({}, req.git2gus, {
                config,
            });
            return next();
        } catch(error) {
            if (error.code === 404) {
                await req.octokitClient.issues.createComment({
                    ...params,
                    number,
                    body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't exists.`,
                });
                return res.status(404).send(error);
            }
            await req.octokitClient.issues.createComment({
                ...params,
                number,
                body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't have right values. You should add the required configuration.`,
            });
            return res.status(403).send(error);
        }
    }
    return next();
}
