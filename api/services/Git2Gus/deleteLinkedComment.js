/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { getComments, deleteComment } = require('../Github');
const getMatchedComments = require('./getMatchedComments');

module.exports = async function deleteLinkedComment({ req, sfid }) {
    const comments = await getComments({ req });
    if (comments && comments.data && Array.isArray(comments.data)) {
        const matchedComments = getMatchedComments(comments.data, sfid);
        matchedComments.forEach(async comment => {
            return await deleteComment({
                req,
                id: comment.id
            });
        });
    }
};
