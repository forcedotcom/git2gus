/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = async function deleteComment({ req, id }) {
    const { repository } = req.body;
    return await req.octokitClient.issues.deleteComment({
        owner: repository.owner.login,
        repo: repository.name,
        comment_id: id
    });
};
