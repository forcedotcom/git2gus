/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const { getConnection, Build } = require('./connection');
const logger = require('../../services/Logs/logger');

module.exports = async function resolveBuild(name) {
    const conn = await getConnection();

    try {
        const ret = await conn
            .sobject(Build)
            .find({ name })
            .execute();
        if (!ret || ret.length === 0) {
            logger.error(`No build with name ${name}`);
        }
        return ret[0].Id;
    } catch (err) {
        logger.error(`Error fetching ADM_Build__c with name ${name}`, err);
        return;
    }
};
