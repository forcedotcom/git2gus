/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const logger = require('../Logs/logger');
const { getConnection, Epic } = require('./connection');

module.exports = async function getEpicById(id) {
    const conn = await getConnection();
    return Promise.resolve(
        conn
            .sobject(Epic)
            .find({ id })
            .execute((err, ret) => {
                if (err) {
                    logger.error('GUS API request failed', { err, ret });
                    return undefined;
                }
                return ret[0];
            })
    );
};
