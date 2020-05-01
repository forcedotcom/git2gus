/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = async function getByName(name = '') {
    try {
        return await Issues.findOne({ name });
    } catch (e) {
        console.log(
            `Error thrown in resolveBuild: ${e.name} with message: ${e.message}`
        );
        throw e;
    }
};
