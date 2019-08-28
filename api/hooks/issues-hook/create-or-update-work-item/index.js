/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Issues = require('../../../services/Issues');

module.exports = async function createOrUpdateWorkItem(task) {
    const {
        subject,
        description,
        storyDetails,
        productTag,
        status,
        foundInBuild,
        priority,
        relatedUrl,
        recordTypeId
    } = task;

    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const alreadyLowestPriority =
        issue && issue.priority !== '' && issue.priority <= priority;
    const recordIdTypeIsSame = issue && issue.recordTypeId === recordTypeId;

    // if issue already exists and already has lowest priority
    // and already has correct recordTypeId then we just return
    if (alreadyLowestPriority && recordIdTypeIsSame) {
        return;
    }

    // else if issue already exists we update it
    if (issue) {
        return await Issues.update(issue.id, { priority, recordTypeId });
    }

    // else we create a new issue
    return await Issues.create({
        subject,
        description,
        storyDetails,
        productTag,
        status,
        foundInBuild,
        priority,
        relatedUrl,
        recordTypeId
    });
};
