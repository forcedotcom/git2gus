/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const isBugLabel = require('./isBugLabel');
const isUserStoryLabel = require('./isUserStoryLabel');
const isInvestigationLabel = require('./isInvestigationLabel');

module.exports = function isSalesforceLabel(name) {
    return (
        isBugLabel(name) || isUserStoryLabel(name) || isInvestigationLabel(name)
    );
};
