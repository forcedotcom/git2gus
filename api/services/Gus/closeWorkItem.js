/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const jsforce = require('jsforce');

module.exports = async function closeWorkItem(relatedUrl, status) {
    const conn = new jsforce.Connection();
    await conn.login(
        process.env.GUS_USERNAME,
        process.env.GUS_PASSWORD,
        async err => {
            if (err) {
                return console.error(err);
            }
        }
    );
    return Promise.resolve(
        conn
            .sobject('ADM_Work__c')
            .find({ related_url__c: relatedUrl })
            .update(
                {
                    status__c: status
                },
                (err, ret) => {
                    if (err || !ret.success) {
                        return console.error(err, ret);
                    }
                    return ret;
                }
            )
    );
};
