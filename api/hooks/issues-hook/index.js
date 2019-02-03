const asyncQueue = require('async/queue')

module.exports = function issuesHook(sails) {
    const queue = asyncQueue(function(task, callback) {
        callback()
    }, 1);

    return { queue };
}
