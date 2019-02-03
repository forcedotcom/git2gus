const asyncQueue = require('async/queue');

module.exports = function issuesHook() {
    const queue = asyncQueue((task, callback) => {
        callback();
    }, 1);

    return { queue };
};
