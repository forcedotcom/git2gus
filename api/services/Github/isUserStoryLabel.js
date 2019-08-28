/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Returns true if the label is a Salesforce USER STORY label
 *
 * @param {string} name
 * @returns {boolean}
 */
function isUserStoryLabel(name) {
    return sails.config.ghLabels.userStoryLabel === name;
}

module.exports = isUserStoryLabel;
