/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const prefix = process.env.SALESFORCE_PREFIX
    ? process.env.SALESFORCE_PREFIX
    : '';

module.exports = {
    tableName: prefix + 'adm_change_list__c',
    attributes: {
        name: 'string',
        sfid: 'string',
        work: {
            type: 'string',
            columnName: prefix + 'work__c',
            required: true
        },
        changelist: {
            type: 'string',
            columnName: prefix + 'perforce_changelist__c',
            allowNull: true
        },
        checkInBy: {
            type: 'string',
            columnName: prefix + 'check_in_by__c',
            allowNull: true
        },
        checkInDate: {
            type: 'ref',
            columnType: 'datetime',
            columnName: prefix + 'check_in_date__c'
        },
        comment: {
            type: 'string',
            columnName: prefix + 'comments__c',
            allowNull: true
        },
        task: {
            type: 'string',
            columnName: prefix + 'task__c'
        }
    },
    migrate: 'safe'
};
