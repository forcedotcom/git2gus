/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Changelists = require('../../../services/Changelists');

module.exports = async function createChangelist(task) {
    const { work, changelist, checkInDate } = task;

    return await Changelists.create({
        work,
        changelist,
        checkInDate
    });
};
