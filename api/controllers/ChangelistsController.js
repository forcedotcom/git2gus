/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Changelists = require('../services/Changelists');

module.exports = {
    async create(req, res) {
        try {
            const changelist = await Changelists.create(req.body);
            return res.json(changelist);
        } catch (error) {
            logError(error);
            return res.serverError(error);
        }
    }
};
