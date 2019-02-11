const asyncQueue = require('async/queue');
const Logger = require('../../services/Logger');

function handleQueue(task) {
    const {
        createLabel,
        owner,
        repo,
        name,
        color,
    } = task;
    const label = {
        owner,
        repo,
        name,
        color,
    };

    Logger.log({
        message: `create deleted ${name} label`,
        event: {
            create_github_label: label,
        }
    });
    return createLabel(label);
}

module.exports = function labelsHook() {
    const queue = asyncQueue(async (task, done = () => {}) => {
        await handleQueue(task);
        done();
    }, 1);

    return { queue };
};
