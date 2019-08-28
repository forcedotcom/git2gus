/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = function getAnnotation(description) {
    if (typeof description === 'string') {
        const matches = description.match(/@w-\d+@/gi);
        if (Array.isArray(matches) && matches.length > 0) {
            return matches[0].replace(/@/g, '');
        }
        return null;
    }
    return null;
};
