/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Issues = require('../../../services/Issues');

module.exports = async function updateWorkItemTitle({ subject, relatedUrl }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue && Issues.weCreateIssue(issue)) {
        return Issues.update(issue.id, { subject });
    }
    return null;
};
