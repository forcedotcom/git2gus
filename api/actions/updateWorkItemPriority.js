/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const GithubEvents = require('../modules/GithubEvents');
const Github = require('../services/Github');

module.exports = {
    eventName: GithubEvents.events.ISSUE_UNLABELED,
    fn: async function(req) {
        const {
            issue: { labels, url },
            label
        } = req.body;

        if (label && Github.isBugLabel(label.name)) {
            const priority = Github.getPriority(labels);
            sails.hooks['issues-hook'].queue.push({
                name: 'UPDATE_WORK_ITEM_PRIORITY',
                priority,
                relatedUrl: url
            });
        }
    }
};
