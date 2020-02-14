/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const pick = require('lodash/pick');

module.exports = async function create(data) {
    const item = pick(data, [
        'work',
        'changelist',
        'checkInBy',
        'checkInDate',
        'comment',
        'task'
    ]);
    return await Changelists.create(item).fetch();
};
