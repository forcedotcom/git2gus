/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Issues = require('../../../services/Issues');

module.exports = async function unlinkWorkItem({ workItemName }) {
    const issue = await Issues.getByName(workItemName);
    if (issue) {
        return Issues.update(issue.id, {
            relatedUrl: null
        });
    }
    return null;
};
