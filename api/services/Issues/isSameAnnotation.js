/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getAnnotation = require('./getAnnotation');

module.exports = function isSameAnnotation(prevDescription, nextDescription) {
    const prevMatch = getAnnotation(prevDescription);
    const nextMatch = getAnnotation(nextDescription);
    if (prevMatch === null && nextMatch === null) {
        return false;
    }
    return prevMatch === nextMatch;
};
