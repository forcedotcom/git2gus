/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const jsforce = require('jsforce');

module.exports = async function createWorkItemInGus(
    subject,
    description,
    productTag,
    status,
    foundInBuild,
    priority,
    relatedUrl,
    recordTypeId
) {
    const conn = new jsforce.Connection();
    await conn.login(
        process.env.GUS_USERNAME,
        process.env.GUS_PASSWORD,
        err => {
            if (err) {
                return console.error(err);
            }
        }
    );
    return Promise.resolve(
        conn.sobject('ADM_Work__c').create(
            {
                Subject__c: subject,
                details__c: description,
                details_and_steps_to_reproduce__c: description,
                product_tag__c: productTag,
                status__c: status,
                found_in_build__c: foundInBuild,
                priority__c: priority,
                related_url__c: relatedUrl,
                recordtypeid: recordTypeId
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
