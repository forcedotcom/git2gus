/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = async function updateDescription({ req, body }) {
    const { repository } = req.body;
    const currentDescription = req.body.issue.body;
    const newDescription = currentDescription.concat('\n', body);
    return await req.octokitClient.issues.update({
        owner: repository.owner.login,
        repo: repository.name,
        issue_number: req.body.issue.number,
        body: newDescription
    });
};
