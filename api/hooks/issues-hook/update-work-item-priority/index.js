/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Issues = require('../../../services/Issues');
const logger = require('../../../services/Logs/logger');

module.exports = async function updateWorkItemPriority({
    priority,
    relatedUrl
}) {
    const issue = await Issues.getByRelatedUrl(relatedUrl);

    // TODO bug? is "priority" comparable with '>' ? The string "P2" is greater than "P1" but semantically its the other way around
    const isNewPriorityGreat = issue && priority > issue.priority;

    if (priority && isNewPriorityGreat) {
        return Issues.update(issue.id, { priority });
    }
    logger.info(
        `Skipping issue update because priority is less than our saved priority`,
        { priority, relatedUrl }
    );
    return null;
};
