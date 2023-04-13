/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const { getConnection, Changelist, field } = require('./connection');

module.exports = async function createChangelistInGus(
    relativeUrl,
    issueId,
    mergedAt
) {
    const conn = await getConnection();
    return conn.sobject(Changelist).create(
        {
            [field('Perforce_Changelist')]: relativeUrl,
            [field('Work')]: issueId,
            [field('External_ID')]: relativeUrl,
            [field('Source')]: 'GitHub',
            [field('Check_In_Date')]: mergedAt,
            [field('Check_In_By')]: process.env.GUS_USER
        },
        (err, ret) => {
            if (err || !ret.success) {
                return console.error(err, ret);
            }
            return ret.id;
        }
    );
};
