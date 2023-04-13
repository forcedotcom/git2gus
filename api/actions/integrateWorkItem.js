/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const GithubEvents = require('../modules/GithubEvents');
const { isWorkItemClosed } = require('../services/Git2Gus');
const { closeWorkItem } = require('../services/Gus');

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
            issue: { html_url }
        } = req.body;
        const { statusWhenClosed } = req.git2gus.config;
        await closeWorkItem(html_url, getStatus(statusWhenClosed));
    }
};
