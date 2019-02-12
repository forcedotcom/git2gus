const Github = require('../services/Github');
const Logger = require('../services/Logger');

function resolveNumber(payload) {
    if (payload.issue) {
        return payload.issue.number;
    }
    if (payload.pull_request) {
        return payload.number;
    }
    return undefined;
}

module.exports = async function hasConfig(req, res, next) {
    const {
        action,
        repository,
    } = req.body;
    const event = req.headers['x-github-event'];
    const isIssueOrPrOpened = (event === 'issues' || event === 'pull_request') && action === 'opened';

    if (event === 'installation' || event === 'integration_installation') {
        return next();
    }

    const params = {
        owner: repository.owner.login,
        repo: repository.name,
    };

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
        Logger.log({
            type: 'error',
            message: error.message || error,
        });
        const number = resolveNumber(req.body);
        if (error.code === 404) {
            if (isIssueOrPrOpened) {
                const comment = {
                    ...params,
                    number,
                    body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't exists.`,
                };
                Logger.log({
                    type: 'error',
                    message: error.message || error,
                    event: {
                        create_github_comment: comment,
                    },
                });
                await req.octokitClient.issues.createComment(comment);
            }
            return res.notFound({
                code: 'CONFIG_NOT_FOUND',
                message: 'The .git2gus/config.json was not found.',
            });
        }
        if (isIssueOrPrOpened) {
            const comment = {
                ...params,
                number,
                body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't have right values. You should add the required configuration.`,
            };
            Logger.log({
                type: 'error',
                message: error.message || error,
                event: {
                    create_github_comment: comment,
                },
            });
            await req.octokitClient.issues.createComment(comment);
        }
        return res.status(403).send(error);
    }
};
