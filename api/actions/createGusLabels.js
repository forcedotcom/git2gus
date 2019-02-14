const GithubEvents = require('../modules/GithubEvents');

module.exports = {
    eventName: GithubEvents.events.INSTALLATION_CREATED,
    fn: async function (req) {
        const {
            repositories,
            installation,
        } = req.body;
        const owner = installation.account.login;

        repositories.forEach((repository) => {
            const repo = repository.name;
            const { labels, labelColor } = sails.config.gus;
            labels.forEach(async (name) => {
                const label = {
                    owner,
                    repo,
                    name,
                    color: labelColor,
                };
                await req.octokitClient.issues.createLabel(label);
            });
        });
    }
};
