/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Gus = require('../services/Gus');
const GithubEvents = require('../modules/GithubEvents');

module.exports = {
    eventName: GithubEvents.events.PULL_REQUEST_OPENED,
    fn: async function(req) {
        const {
            pull_request: { title, html_url: pr_url, body }
        } = req.body;
        const workItemInTitleOrBody = title
            .concat(body)
            .match('@[Ww]-\\d{6,8}@');
        if (workItemInTitleOrBody) {
            const workItemName = workItemInTitleOrBody[0].substring(
                1,
                workItemInTitleOrBody[0].length - 1
            );
            const issueId = await Gus.getWorkItemIdByName(workItemName);
            Gus.createComment(
                'A Pull Request is now open for this work item '.concat(pr_url),
                issueId
            );
        }
    }
};
