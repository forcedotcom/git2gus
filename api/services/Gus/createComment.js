/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const { getConnection } = require('./connection');

module.exports = async function createComment(comment, issueId) {
    const conn = await getConnection();
    return conn.sobject('FeedItem').create(
        {
            Body: comment,
            ParentId: issueId
        },
        (err, ret) => {
            if (err || !ret.success) {
                return console.error(err, ret);
            }
            return ret.id;
        }
    );
};
