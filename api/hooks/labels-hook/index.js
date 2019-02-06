const asyncQueue = require('async/queue');

function handleQueue(task) {
    const {
        createLabel,
        owner,
        repo,
        name,
        color,
    } = task;

    console.log(`create deleted ${name} label`);
    return createLabel({
        owner,
        repo,
        name,
        color,
    });
}

module.exports = function labelsHook() {
    const queue = asyncQueue(async (task, done = () => {}) => {
        await handleQueue(task);
        done();
    }, 1);

    return { queue };
};
