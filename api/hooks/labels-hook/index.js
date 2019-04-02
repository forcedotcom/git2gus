const asyncQueue = require('async/queue');

module.exports = function labelsHook() {
    const queue = asyncQueue(async function labelQueueConsumer(
        task,
        done = () => {}
    ) {
        await task.execute();
        return done();
    },
    1);
    return { queue };
};
