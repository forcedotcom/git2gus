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
            pull_request: {
                title,
                html_url: pr_url,
                body,
                merge_commit_sha,
                merged_at,
                head: {
                    repo: { html_url: repo_url }
                }
            }
        } = req.body;
        const workItemInTitleOrBody = title
            .concat(body)
            .match('@[Ww]-\\d{6,8}@');
        if (workItemInTitleOrBody) {
            const workItemName = workItemInTitleOrBody[0].substring(
                1,
                workItemInTitleOrBody[0].length - 1
            );

            const changelistUrl = convertUrlToGusFormat(
                repo_url,
                merge_commit_sha,
                pr_url
            );
            const issueId = await Gus.getWorkItemIdByName(workItemName);
            Gus.createChangelistInGus(changelistUrl, issueId, merged_at);
        }
    }
};
