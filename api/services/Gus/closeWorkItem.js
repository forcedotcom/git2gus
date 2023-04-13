/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const { getConnection, Work, field } = require('./connection');
const logger = require('../Logs/logger');

module.exports = async function closeWorkItem(relatedUrl, status) {
    const conn = await getConnection();
    let ret = await conn
        .sobject(Work)
        .find({ [field('related_url')]: relatedUrl })
        .update({
            [field('status')]: status
        });

    // ret will already be an array if find() returned multiple work
    if (!Array.isArray(ret)) {
        ret = [ret];
    }

    const errors = ret
        .filter(r => !r.success)
        .map(r => {
            logger.error(`Error updating work ${r.id}`, r.errors);
            return new Error(`Id ${r.id}: ${r.errors}`);
        });
    if (errors.length > 0) {
        throw new AggregateError(errors, 'Errors closing work');
    }
    return ret;
};
