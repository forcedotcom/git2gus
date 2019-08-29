/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const prefix = process.env.SALESFORCE_PREFIX
    ? process.env.SALESFORCE_PREFIX
    : '';

module.exports = {
    tableName: prefix + 'adm_build__c',
    attributes: {
        name: 'string',
        createdAt: {
            type: 'ref',
            columnType: 'datetime',
            columnName: 'createddate'
        },
        sfid: 'string'
    },
    migrate: 'safe'
};
