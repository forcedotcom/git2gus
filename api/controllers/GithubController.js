/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = {
    async processEvent(req, res) {
        await sails.config.ghEvents.emitFromReq(req);
        return res.ok({
            status: 'OK'
        });
    }
};
