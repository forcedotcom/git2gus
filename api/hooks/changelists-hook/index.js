/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const asyncQueue = require('async/queue');
const createChangelist = require('./create-changelist');

async function handleQueue(task) {
    switch (task.name) {
        case 'CREATE_CHANGELIST':
            return await createChangelist(task);
    }
}

module.exports = function issuesHook() {
    const queue = asyncQueue(async task => {
        return await handleQueue(task);
    });
    return { queue };
};
