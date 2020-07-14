/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const jsforce = require('jsforce');

module.exports = function createChangelistInGus(
    relativeUrl,
    issueId,
    mergedAt
) {
    const conn = new jsforce.Connection();
    conn.login(process.env.GUS_USERNAME, process.env.GUS_PASSWORD, err => {
        if (err) {
            return console.error(err);
        }
        conn.sobject('ADM_Change_List__c').create(
            {
                Perforce_Changelist__c: relativeUrl,
                Work__c: issueId,
                External_ID__c: relativeUrl,
                Source__c: 'GitHub',
                Check_In_Date__c: mergedAt,
                Check_In_By__c: process.env.GUS_USER
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
