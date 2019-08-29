/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Builds = require('./../services/Builds');

module.exports = {
    async getBuildByName(req, res) {
        const { name } = req.params;
        const build = await Builds.getBuildByName(name);
        return res.ok(build);
    }
};
