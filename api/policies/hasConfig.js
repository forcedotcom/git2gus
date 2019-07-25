const { getConfig, createComment } = require('../services/Github');
const { github } = require('../../config/github');

module.exports = async function hasConfig(req, res, next) {
    const { action, repository } = req.body;
    const event = req.headers['x-github-event'];

    if (github.installationEvents.indexOf(event) !== -1) {
        return next();
    }

    try {
        const config = await getConfig({
            owner: repository.owner.login,
            repo: repository.name,
            repoUrl: repository.url,
            octokitClient: req.octokitClient,
            octokitTokenClient: req.octokitTokenClient
        });
        req.git2gus = Object.assign({}, req.git2gus, {
            config
        });
        return next();
    } catch (error) {
        const isIssueOrPrOpened =
            (event === 'issues' || event === 'pull_request') &&
            action === 'opened';
        if (error.status === 404) {
            if (isIssueOrPrOpened) {
                await createComment({
                    req,
                    body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't exists.`
                });
            }
            return res.notFound({
                status: 'CONFIG_NOT_FOUND',
                message: 'The .git2gus/config.json was not found.'
            });
        }
        if (isIssueOrPrOpened) {
            await createComment({
                req,
                body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't have right values. You should add the required configuration.`
            });
        }
        return res.status(403).send(error);
    }
};
