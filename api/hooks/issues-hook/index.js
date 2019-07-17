const asyncQueue = require('async/queue');
const createOrUpdateGusItem = require('./create-or-update-work-item');
const updateGusItemPriority = require('./update-work-item-priority');
const updateGusItemRecordTypeId = require('./update-work-item-recordtypeid');
const updateGusItemTitle = require('./update-work-item-title');
const updateGusItemDescription = require('./update-work-item-description');
const integrateGusItem = require('./integrate-work-item');
const linkToGusItem = require('./link-to-work-item');
const unlinkGusItem = require('./unlink-work-item');

async function handleQueue(task) {
    switch (task.name) {
        case 'CREATE_WORK_ITEM':
            return await createOrUpdateGusItem(task);

        case 'UPDATE_WORK_ITEM_PRIORITY':
            return await updateGusItemPriority(task);

        case 'UPDATE_WORK_ITEM_RECORDTYPEID':
            return await updateGusItemRecordTypeId(task);

        case 'UPDATE_WORK_ITEM_TITLE':
            return await updateGusItemTitle(task);

        case 'UPDATE_WORK_ITEM_DESCRIPTION':
            return await updateGusItemDescription(task);

        case 'INTEGRATE_WORK_ITEM':
            return await integrateGusItem(task);

        case 'LINK_TO_WORK_ITEM':
            return await linkToGusItem(task);

        case 'UNLINK_WORK_ITEM':
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
