const GithubEvents = require('../modules/GithubEvents');
const Builds = require('../services/Builds');
const Github =  require('../services/Github');
const Issues = require('../services/Issues');

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

        if (Github.isGusLabel(label.name)) {
            const priority = Github.getPriority(labels);

            let foundInBuild;
            try {
                foundInBuild = await resolveBuild(config, milestone);
            } catch(error) {
                console.log(error);
                return await req.octokitClient.issues.createComment({
                    owner: repository.owner.login,
                    repo: repository.name,
                    number,
                    body: getBuildErrorMessage(milestone),
                });
            }

            const issue = await Issues.getByRelatedUrl(url);
            const hasCurrentPriority = issue && issue.priority <= priority;

            if (priority && foundInBuild && !hasCurrentPriority) {
                sails.hooks['issues-hook'].queue.push('issue labeled', async () => {
                    if (issue) {
                        return Issues.update(issue.id, { priority });
                    }
                    return Issues.create({
                        subject: title,
                        description: body,
                        productTag: config.productTag,
                        status: 'NEW',
                        foundInBuild,
                        priority,
                        relatedUrl: url,
                    });
                });
            }
        }
    }
};
