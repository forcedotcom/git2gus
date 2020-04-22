/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const URL = require('url');

function convertUrlToGusFormat(url) {
    return URL.parse(url)
        .pathname.replace('pulls', 'pull')
        .replace('/repos/', '');
}
exports.convertUrlToGusFormat = convertUrlToGusFormat;
