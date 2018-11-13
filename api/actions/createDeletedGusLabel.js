const GithubEvents = require('../modules/GithubEvents');

function isGusLabel(name) {
    return sails.config.gus.labels.indexOf(name) !== -1;
}

module.exports = {
    eventName: GithubEvents.events.LABEL_DELETED,
    fn: function (req) {
        const {
            label: { name },
            repository,
        } = req.body;
        const { labelColor } = sails.config.gus;

        if (isGusLabel(name)) {
            return req.octokitClient.issues.createLabel({
                owner: repository.owner.login,
                repo: repository.name,
                name,
                color: labelColor,
            });
        }
    }
}
