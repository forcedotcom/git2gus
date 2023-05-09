/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = function getAnnotation(description) {
    const annotationMatchers = [
        {
            rex: /@w-\d+@/gi,
            replace: /@/g
        },
        {
            rex: /\bGUS-W-\d+\b/g,
            replace: /GUS-/g
        }
    ];

    if (typeof description === 'string') {
        const matches = [];
        annotationMatchers.forEach(matcher => {
            let candidates = description.match(matcher.rex);
            if (Array.isArray(candidates) && candidates.length > 0) {
                matches.push(candidates[0].replace(matcher.replace, ''));
            }
        });

        if (matches.length > 0) {
            return matches[0];
        }
        return null;
    }
    return null;
};
