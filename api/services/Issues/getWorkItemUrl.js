/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = function getWorkItemUrl(item, hideUrl) {
    if (hideUrl) {
        return item.name;
    }

    return `[${item.name}](${process.env.WORK_ITEM_BASE_URL + item.sfid}/view)`;
};
