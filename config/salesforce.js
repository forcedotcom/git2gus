/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports.salesforce = {
    salesforceUserId: process.env.GUS_USER,
    status: ['INTEGRATE', 'FIXED', 'CLOSED'],
    userStoryRecordTypeId: process.env.USER_STORY_RECORD_TYPE_ID,
    /* Note: bugRecordTypeId is adm_work__c default record type */
    bugRecordTypeId: process.env.BUG_RECORD_TYPE_ID,
    investigationRecordTypeId: process.env.INVESTIGATION_RECORD_TYPE_ID
};
