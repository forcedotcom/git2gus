/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = function getMatchedComments(comments = [], sfid) {
    return comments.filter(comment => {
        const matches = comment.body.split('/');
        if (Array.isArray(matches) && matches.length > 0) {
            return matches[6] === sfid;
        }
        return false;
    });
};
