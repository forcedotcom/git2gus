const asyncQueue = require('async/queue');

module.exports = function labelsHook() {
    const queue = asyncQueue(async (task, done = () => {}) => {
        await task.execute();
        done();
    }, 1);

    return { queue };
};
