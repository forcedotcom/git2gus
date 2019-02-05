const asyncQueue = require('async/queue');
const createOrUpdateGusItem = require('./create-or-update-gus-item');
const updateGusItem = require('./update-gus-Item');

function handleQueue(task) {
    switch (task.name) {
        case 'create gus item':
            return createOrUpdateGusItem(task);

        case 'update gus item':
            return updateGusItem(task);

        default:
            return null;
    }
}

module.exports = function issuesHook() {
    const queue = asyncQueue(async (task, done = () => {}) => {
        await handleQueue(task);
        done();
    }, 1);

    return { queue };
};
