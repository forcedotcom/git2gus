module.exports.salesforce = {
    salesforceUserId: process.env.SALESFORCE_USER_ID,
    status: ['INTEGRATE', 'FIXED', 'CLOSED'],
    userStoryRecordTypeId: process.env.USER_STORY_RECORD_TYPE_ID,
    /* Note: bugRecordTypeId is adm_work__c default record type */
    bugRecordTypeId: process.env.BUG_RECORD_TYPE_ID,
    investigationRecordTypeId: process.env.INVESTIGATION_RECORD_TYPE_ID
};
