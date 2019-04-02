const asyncQueue = require('async/queue');
const createOrUpdateGusItem = require('./create-or-update-gus-item');
const updateGusItemPriority = require('./update-gus-item-priority');
const updateGusItemTitle = require('./update-gus-item-title');
const updateGusItemDescription = require('./update-gus-item-description');
const integrateGusItem = require('./integrate-gus-item');
const linkToGusItem = require('./link-to-gus-item');
const unlinkGusItem = require('./unlink-gus-item');

async function handleQueue(task) {
    switch (task.name) {
        case 'CREATE_GUS_ITEM':
            return await createOrUpdateGusItem(task);

        case 'UPDATE_GUS_ITEM_PRIORITY':
            return await updateGusItemPriority(task);

        case 'UPDATE_GUS_ITEM_TITLE':
            return await updateGusItemTitle(task);

        case 'UPDATE_GUS_ITEM_DESCRIPTION':
            return await updateGusItemDescription(task);

        case 'INTEGRATE_GUS_ITEM':
            return await integrateGusItem(task);

        case 'LINK_TO_GUS_ITEM':
            return await linkToGusItem(task);

        case 'UNLINK_GUS_ITEM':
            return await unlinkGusItem(task);
        default:
            return null;
    }
}

module.exports = function issuesHook() {
    const queue = asyncQueue(async task => {
        return await handleQueue(task);
    });
    return { queue };
};
