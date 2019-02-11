const GithubEvents = require('../modules/GithubEvents');
const Github =  require('../services/Github');
const Logger = require('../services/Logger');

module.exports = {
    eventName: GithubEvents.events.LABEL_DELETED,
    fn: function (req) {
        const {
            label: { name },
            repository,
        } = req.body;
        const { labelColor } = sails.config.gus;
        Logger.log({ message: `handling ${GithubEvents.events.LABEL_DELETED} event` });

        if (Github.isGusLabel(name)) {
            sails.hooks['labels-hook'].queue.push({
                createLabel: req.octokitClient.issues.createLabel,
                owner: repository.owner.login,
                repo: repository.name,
                name,
                color: labelColor,
            }, () => Logger.log({ message: 'done createDeletedGusLabel action' }));
        }
    }
};
