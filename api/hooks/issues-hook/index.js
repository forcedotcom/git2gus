/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const asyncQueue = require('async/queue');
const createOrUpdateWorkItem = require('./create-or-update-work-item');
const updateWorkItemPriority = require('./update-work-item-priority');
const updateWorkItemRecordTypeId = require('./update-work-item-recordtypeid');
const updateWorkItemTitle = require('./update-work-item-title');
const updateWorkItemDescription = require('./update-work-item-description');
const integrateWorkItem = require('./integrate-work-item');
const linkToWorkItem = require('./link-to-work-item');
const unlinkWorkItem = require('./unlink-work-item');
const logger = require('../../services/Logs/logger');

async function handleQueue(task) {
    logger.info(`Handling task ${task.name}`);
    switch (task.name) {
        case 'CREATE_WORK_ITEM':
            return await createOrUpdateWorkItem(task);

        case 'UPDATE_WORK_ITEM_PRIORITY':
            return await updateWorkItemPriority(task);

        case 'UPDATE_WORK_ITEM_RECORDTYPEID':
            return await updateWorkItemRecordTypeId(task);

        case 'UPDATE_WORK_ITEM_TITLE':
            return await updateWorkItemTitle(task);

        case 'UPDATE_WORK_ITEM_DESCRIPTION':
            return await updateWorkItemDescription(task);

        case 'INTEGRATE_WORK_ITEM':
            return await integrateWorkItem(task);

        case 'LINK_TO_WORK_ITEM':
            return await linkToWorkItem(task);

        case 'UNLINK_WORK_ITEM':
            return await unlinkWorkItem(task);
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
