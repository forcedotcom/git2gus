const GithubEvents = require('../modules/GithubEvents');
const Builds = require('../services/Builds');
const Github =  require('../services/Github');

function getBuildErrorMessage(config, milestone) {
    if (milestone) {
        return `The milestone assigned to the issue doesn't match any valid build in GUS.`;
    }
    return `The defaultBuild value ${config.defaultBuild} in \`.git2gus/config.json\` doesn't match any valid build in GUS.`;
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
            const foundInBuild = await Builds.resolveBuild(config, milestone);

            if (foundInBuild) {
                return sails.hooks['issues-hook'].queue.push({
                    name: 'CREATE_GUS_ITEM',
                    subject: title,
                    description: body,
                    productTag: config.productTag,
                    status: 'NEW',
                    foundInBuild,
                    priority,
                    relatedUrl: url,
                });
            }
            return await req.octokitClient.issues.createComment({
                owner: repository.owner.login,
                repo: repository.name,
                number,
                body: getBuildErrorMessage(config, milestone),
            });
        }
        return null;
    }
};
