/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const GithubEvents = require('../modules/GithubEvents');
const Issues = require('../services/Issues');

module.exports = {
    eventName: GithubEvents.events.PULL_REQUEST_CLOSED,
    fn: async function(req) {
        const {
            pull_request: { title, url, closed_at }
        } = req.body;
        if (title.includes('@W-')) {
            var workItemName = 'W-'.concat(title.split('@W-')[1].slice(0, -1));
            var issue = await Issues.getByName(workItemName);
            console.log('Returned issue is:');
            console.log(issue);
            console.log('********');
            sails.hooks['changelists-hook'].queue.push({
                name: 'CREATE_CHANGELIST',
                work: issue.sfid,
                changelist: url,
                checkInDate: closed_at,
                comment: url,
                task: title
            });
        }
    }
};
