/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Issues = require('../../../services/Issues');

module.exports = async function updateWorkItemPriority({
    priority,
    relatedUrl
}) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const isNewPriorityGreat = issue && priority > issue.priority;
    if (priority && isNewPriorityGreat) {
        return Issues.update(issue.id, { priority });
    }
    return null;
};
