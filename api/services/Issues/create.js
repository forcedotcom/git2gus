/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const pick = require('lodash/pick');

module.exports = async function create(data) {
    const item = pick(data, [
        'subject',
        'description',
        'storyDetails',
        'productTag',
        'status',
        'foundInBuild',
        'priority',
        'relatedUrl'
    ]);
    return await Issues.create(item).fetch();
};
