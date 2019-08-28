/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Issues = require('../../../services/Issues');

module.exports = async function integrateWorkItem({ relatedUrl, status }) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);
    if (issue && issue.status.toUpperCase() !== 'CLOSED') {
        return Issues.update(issue.id, {
            status
        });
    }
    return null;
};
