/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const GithubEvents = require('../modules/GithubEvents');
const { isWorkItemClosed } = require('../services/Git2Gus');

function getStatus(statusWhenClosed) {
    if (statusWhenClosed && isWorkItemClosed(statusWhenClosed)) {
        return statusWhenClosed;
    }
    return 'INTEGRATE';
}

module.exports = {
    eventName: GithubEvents.events.ISSUE_CLOSED,
    fn: async function(req) {
        const {
            issue: { url }
        } = req.body;
        const { statusWhenClosed } = req.git2gus.config;

        sails.hooks['issues-hook'].queue.push({
            name: 'INTEGRATE_WORK_ITEM',
            relatedUrl: url,
            status: getStatus(statusWhenClosed)
        });
    }
};
