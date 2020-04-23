/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Gus = require('../services/Gus');
const { convertUrlToGusFormat } = require('./utils/convertUrlToGusFormat');
const GithubEvents = require('../modules/GithubEvents');

module.exports = {
    eventName: GithubEvents.events.PULL_REQUEST_CLOSED,
    fn: async function(req) {
        const {
            pull_request: { title, url }
        } = req.body;
        if (title.includes('@W-')) {
            const workItemName = 'W-'.concat(
                title.split('@W-')[1].slice(0, -1)
            );

            const issueId = await Gus.getWorkItemIdByName(workItemName);
            const relativeUrl = convertUrlToGusFormat(url);
            Gus.createChangelistInGus(relativeUrl, issueId);
        }
    }
};
