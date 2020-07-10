/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const URL = require('url');

function convertUrlToGusFormat(repo_url, merge_commit_sha, pr_url) {
    if (merge_commit_sha) {
        return URL.parse(repo_url)
            .pathname.concat('/commit/')
            .concat(merge_commit_sha)
            .substr(1);
    }
    return URL.parse(pr_url).pathname.substr(1);
}
exports.convertUrlToGusFormat = convertUrlToGusFormat;
