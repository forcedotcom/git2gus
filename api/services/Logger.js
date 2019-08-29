/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const timber = require('timber');

const transport = new timber.transports.HTTPS(process.env.TIMBER_API_KEY);
timber.install(transport);

const types = new Set(['info', 'warn', 'error']);

class Logger {
    log(payload) {
        const { message, event } = payload;
        let { type } = payload;
        if (!types.has(type)) {
            type = 'info';
        }
        if (event) {
            return console[type](message, { event });
        }
        return console[type](message);
    }
}

module.exports = new Logger();
