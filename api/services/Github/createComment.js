/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

function getNumber(body) {
    if (body.issue) {
        return body.issue.number;
    }
    if (body.pull_request) {
        return body.number;
    }
    return undefined;
}

module.exports = async function createComment({ req, body }) {
    const { repository } = req.body;
    return await req.octokitClient.issues.createComment({
        owner: repository.owner.login,
        repo: repository.name,
        issue_number: getNumber(req.body),
        body
    });
};
