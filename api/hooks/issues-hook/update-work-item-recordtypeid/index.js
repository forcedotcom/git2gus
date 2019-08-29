/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// @ts-check
const Issues = require('../../../services/Issues');

/**
 * Update a work item's RecordTypeId. If the work item already has the given
 * RecordTypeId then the work item will not be updated.
 *
 * @param {{recordTypeId: string, relatedUrl: string}} task
 * @returns
 */
async function updateWorkItemRecordTypeId({ recordTypeId, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const newRecordTypeId = issue && issue.recordTypeId !== recordTypeId;
    if (newRecordTypeId && recordTypeId !== undefined) {
        return Issues.update(issue.id, { recordTypeId });
    }
    return null;
}

module.exports = updateWorkItemRecordTypeId;
