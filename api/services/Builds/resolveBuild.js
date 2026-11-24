/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const logger = require('../Logs/logger');
const getBuildByName = require('./getBuildByName');

module.exports = async function resolveBuild(config, milestone) {
    try {
        const build = milestone ? milestone.title : config.defaultBuild;
        logger.info(`Retrieving build: ${build}`);
        const buildFromDb = await getBuildByName(build);
        logger.info(`Retrieving buildFromDb: ${buildFromDb}`);
        if (buildFromDb) {
            return buildFromDb.sfid;
        }
    } catch (e) {
        logger.info(
            `Error thrown in resolveBuild: ${e.name} with message: ${e.message}`
        );
    }
    return null;
};
