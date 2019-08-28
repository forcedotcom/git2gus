/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const GithubEvents = require('../modules/GithubEvents');

module.exports = {
    eventName: GithubEvents.events.ISSUE_EDITED,
    fn: async function(req) {
        const {
            changes,
            issue: { body, url }
        } = req.body;
        const isDescriptionEdited = !!changes.body;

        if (isDescriptionEdited) {
            sails.hooks['issues-hook'].queue.push({
                name: 'UPDATE_WORK_ITEM_DESCRIPTION',
                description: body,
                storyDetails: body,
                relatedUrl: url
            });
        }
    }
};
