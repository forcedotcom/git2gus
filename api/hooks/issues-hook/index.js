const asyncQueue = require('async/queue');
const createOrUpdateGusItem = require('./create-or-update-gus-item');
const updateGusItemPriority = require('./update-gus-item-priority');
const updateGusItemTitle = require('./update-gus-item-title');
const updateGusItemDescription = require('./update-gus-item-description');
const integrateGusItem =  require('./integrate-gus-item');
const linkToGusItem = require('./link-to-gus-item');

function handleQueue(task) {
    switch (task.name) {
        case 'CREATE_GUS_ITEM':
            return createOrUpdateGusItem(task);

        case 'UPDATE_GUS_ITEM_PRIORITY':
            return updateGusItemPriority(task);

        case 'UPDATE_GUS_ITEM_TITLE':
            return updateGusItemTitle(task);

        case 'UPDATE_GUS_ITEM_DESCRIPTION':
            return updateGusItemDescription(task);

        case 'INTEGRATE_GUS_ITEM':
            return integrateGusItem(task);

        case 'LINK_TO_GUS_ITEM':
            return linkToGusItem(task);
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
