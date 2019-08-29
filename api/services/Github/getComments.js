/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = async function getComments({ req }) {
    const {
        issue: { number },
        repository
    } = req.body;
    return await req.octokitClient.issues.listComments({
        owner: repository.owner.login,
        repo: repository.name,
        number
    });
};
