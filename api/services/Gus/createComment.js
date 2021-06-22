/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const jsforce = require('jsforce');

module.exports = function createComment(comment, issueId) {
    const conn = new jsforce.Connection();
    conn.login(process.env.GUS_USERNAME, process.env.GUS_PASSWORD, err => {
        if (err) {
            return console.error(err);
        }
        conn.sobject('FeedItem').create(
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
    });
};
