/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getConfig = require('./getConfig');
const createTable = require('./createTable');
const isSalesforceLabel = require('./isSalesforceLabel');
const isBugLabel = require('./isBugLabel');
const isUserStoryLabel = require('./isUserStoryLabel');
const isInvestigationLabel = require('./isInvestigationLabel');
const getPriority = require('./getPriority');
const createComment = require('./createComment');
const addLabels = require('./addLabels');
const getComments = require('./getComments');
const deleteComment = require('./deleteComment');
const getRecordTypeId = require('./getRecordTypeId');
const updateDescription = require('./updateDescription');

module.exports = {
    getConfig,
    createTable,
    isSalesforceLabel,
    isBugLabel,
    isUserStoryLabel,
    isInvestigationLabel,
    getPriority,
    createComment,
    addLabels,
    getComments,
    deleteComment,
    getRecordTypeId,
    updateDescription
};
