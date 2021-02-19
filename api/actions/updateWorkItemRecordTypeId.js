/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// @ts-check
const GithubEvents = require('../modules/GithubEvents');
const Github = require('../services/Github');

/**
 * @typedef {global & {sails: any}} TypedGlobal
 * @typedef {import("@octokit/rest").IssuesGetEventResponseIssueLabelsItem} Label
 */

module.exports = {
    eventName: GithubEvents.events.ISSUE_UNLABELED,
    /**
     * @param {{ body: { issue: any; label: Label; }; }} req
     */
    fn: async function(req) {
        const {
            issue: { labels, html_url },
            label
        } = req.body;

        if (label && Github.isSalesforceLabel(label.name)) {
            const recordTypeId = Github.getRecordTypeId(labels);
            /**@type{TypedGlobal} */ (global).sails.hooks[
                'issues-hook'
            ].queue.push({
                name: 'UPDATE_WORK_ITEM_RECORDTYPEID',
                recordTypeId,
                relatedUrl: html_url
            });
        }
    }
};
