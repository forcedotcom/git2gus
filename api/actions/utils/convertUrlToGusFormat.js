/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

function convertUrlToGusFormat(repo_url, merge_commit_sha, pr_url) {
    if (merge_commit_sha) {
        return repo_url.concat('/commit/').concat(merge_commit_sha);
    }
    return pr_url;
}
exports.convertUrlToGusFormat = convertUrlToGusFormat;
