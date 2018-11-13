const GithubEvents = require('../modules/GithubEvents');

module.exports = {
    eventName: GithubEvents.events.INSTALLATION_CREATED,
    fn: async function (req) {
        const {
            repositories,
            sender,
        } = req.body;
        const owner = sender.login;

        repositories.forEach((repository) => {
            const repo = repository.name;
            const { labels, labelColor } = sails.config.gus;
            labels.forEach(async (name) => {
                try {
                    await req.octokitClient.issues.createLabel({
                        owner,
                        repo,
                        name,
                        color: labelColor,
                    });
                } catch (err) {
                    console.error(err);
                }
            });
        });
    }
}
