const GithubEvents = require('../modules/GithubEvents');
const Logger = require('../services/Logger');

module.exports = {
    eventName: GithubEvents.events.INSTALLATION_CREATED,
    fn: async function (req) {
        const {
            repositories,
            sender,
        } = req.body;
        const owner = sender.login;
        Logger.log({ message: `handling ${GithubEvents.events.INSTALLATION_CREATED} event` });

        repositories.forEach((repository) => {
            const repo = repository.name;
            const { labels, labelColor } = sails.config.gus;
            labels.forEach(async (name) => {
                try {
                    const label = {
                        owner,
                        repo,
                        name,
                        color: labelColor,
                    };
                    Logger.log({
                        message: `create ${name} github label in ${repo} repo`,
                        event: {
                            create_github_label: label,
                        },
                    });
                    await req.octokitClient.issues.createLabel(label);
                } catch(err) {
                    Logger.log({
                        type: 'error',
                        message: err,
                    });
                }
            });
        });
    }
};
