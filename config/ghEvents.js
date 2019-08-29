/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const GithubEvents = require('./../api/modules/GithubEvents');
const ghEvents = new GithubEvents();

const actions = require('require-all')({
    dirname: `${__dirname}/../api/actions`,
    filter: /^.+.js$/,
    recursive: false
});

Object.keys(actions).forEach(actionName => {
    const { eventName, fn } = actions[actionName];

    if (typeof eventName === 'string') {
        console.log(`attach ${actionName} to ${eventName}`);
        ghEvents.on(eventName, fn);
    }
    if (Array.isArray(eventName)) {
        eventName.forEach(event => {
            console.log(`attach ${actionName} to ${event}`);
            ghEvents.on(event, fn);
        });
    }
});

module.exports.ghEvents = ghEvents;
