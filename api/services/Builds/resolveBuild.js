/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getBuildByName = require('./getBuildByName');

module.exports = async function resolveBuild(config, milestone) {
    try {
        const build = milestone ? milestone.title : config.defaultBuild;
        console.log(`Retrieving build: ${build}`);
        const buildFromDb = await getBuildByName(build);
        console.log(`Retrieving buildFromDb: ${buildFromDb}`);
        if (buildFromDb) {
            return buildFromDb.sfid;
        }
    } catch (e) {
        console.log(
            `Error thrown in resolveBuild: ${e.name} with message: ${e.message}`
        );
    }
    return null;
};
