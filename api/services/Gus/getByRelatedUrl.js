/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const { getConnection, Work, field } = require('./connection');

module.exports = async function getByRelatedUrl(relatedUrl) {
    const conn = await getConnection();
    return Promise.resolve(
        conn
            .sobject(Work)
            .find({ [field('related_url')]: relatedUrl })
            .execute((err, ret) => {
                if (err) {
                    return console.error(err, ret);
                }
                return ret[0];
            })
    );
};
