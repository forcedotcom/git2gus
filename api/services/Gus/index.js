/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const createChangelistInGus = require('./createChangelistInGus');
const getWorkItemIdByName = require('./getWorkItemIdByName');
const resolveBuild = require('./resolveBuild');
const createWorkItemInGus = require('./createWorkItemInGus');
const closeWorkItem = require('./closeWorkItem');
const getByRelatedUrl = require('./getByRelatedUrl');
const getById = require('./getById');
const getBugRecordTypeId = require('./getBugRecordTypeId');

module.exports = {
    createChangelistInGus,
    getWorkItemIdByName,
    resolveBuild,
    createWorkItemInGus,
    closeWorkItem,
    getByRelatedUrl,
    getById,
    getBugRecordTypeId
};
