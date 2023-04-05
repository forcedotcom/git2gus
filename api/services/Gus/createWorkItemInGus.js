/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const { getConnection, Work, field } = require('./connection');

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
    const conn = await getConnection();
    return Promise.resolve(
        conn.sobject(Work).create(
            {
                [field('Subject')]: subject,
                [field('details')]: description,
                [field('details_and_steps_to_reproduce')]: description,
                [field('product_tag')]: productTag,
                [field('status')]: status,
                [field('found_in_build')]: foundInBuild,
                [field('priority')]: priority,
                [field('related_url')]: relatedUrl,
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
