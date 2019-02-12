const GithubEvents = require('../modules/GithubEvents');
const Builds = require('../services/Builds');
const Github =  require('../services/Github');
const Logger = require('../services/Logger');

async function resolveBuild(config, milestone) {
    const build = milestone ? milestone.title : config.defaultBuild;
    const buildFromDb = await Builds.getBuildByName(build);
    if (buildFromDb) {
        return buildFromDb.sfid;
    }
    return Promise.reject({
        code: 'BUILD_NOT_FOUND',
        message: 'The build was not found.',
    });
}

function getBuildErrorMessage(milestone) {
    if (milestone) {
        return `The milestone doesn't match any valid build.`;
    }
    return `The defaultBuild in \`.git2gus/config.json\` doesn't match any valid build.`;
}

module.exports = {
    eventName: GithubEvents.events.ISSUE_LABELED,
    fn: async function(req) {
        const {
            issue: {
                labels,
                url,
                title,
                body,
                milestone,
                number,
            },
            label,
            repository,
        } = req.body;
        const { config } = req.git2gus;
        Logger.log({
            message: `Handling ${GithubEvents.events.ISSUE_LABELED} event`,
        });

        if (Github.isGusLabel(label.name)) {
            const priority = Github.getPriority(labels);

            let foundInBuild;
            try {
                foundInBuild = await resolveBuild(config, milestone);
            } catch(error) {
                const comment = {
                    owner: repository.owner.login,
                    repo: repository.name,
                    number,
                    body: getBuildErrorMessage(milestone),
                };
                Logger.log({
                    type: 'error',
                    message: error.message || error,
                    event: {
                        create_github_comment: comment,
                    },
                });
                return await req.octokitClient.issues.createComment(comment);
            }

            if (priority && foundInBuild) {
                sails.hooks['issues-hook'].queue.push({
                    name: 'CREATE_GUS_ITEM',
                    subject: title,
                    description: body,
                    productTag: config.productTag,
                    status: 'NEW',
                    foundInBuild,
                    priority,
                    relatedUrl: url,
                }, () => Logger.log({
                    message: 'Done createGusItem action.',
                }));
            }
        }
    }
};
