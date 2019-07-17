const GithubEvents = require('../modules/GithubEvents');

function getRepositories(req) {
    if (
        GithubEvents.match(
            req,
            GithubEvents.events.INSTALLATION_REPOSITORIES_ADDED
        )
    ) {
        return req.body.repositories_added;
    }
    return req.body.repositories;
}

module.exports = {
    eventName: [
        GithubEvents.events.INSTALLATION_CREATED,
        GithubEvents.events.INSTALLATION_REPOSITORIES_ADDED
    ],
    fn: async function(req) {
        const { installation } = req.body;
        const owner = installation.account.login;
        const repositories = getRepositories(req);

        repositories.forEach(async repository => {
            const repo = repository.name;
            const {
                bugLabels,
                bugLabelColor,
                storyLabel,
                storyLabelColor
            } = sails.config.ghLabels;

            // add the bug labels
            bugLabels.forEach(async name => {
                const label = {
                    owner,
                    repo,
                    name,
                    color: bugLabelColor
                };
                await req.octokitClient.issues.createLabel(label);
            });

            // add the story label
            await req.octokitClient.issues.createLabel({
                owner,
                repo,
                name: storyLabel,
                color: storyLabelColor
            });
        });
    }
};
