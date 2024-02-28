/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const URL = require('url');

function convertUrlToGusFormat(pr_url) {
    return URL.parse(pr_url).pathname.substring(1);
}
exports.convertUrlToGusFormat = convertUrlToGusFormat;
