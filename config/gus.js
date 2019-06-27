module.exports.gus = {
    bugLabels: ['GUS P0', 'GUS P1', 'GUS P2', 'GUS P3'],
    bugLabelColor: 'ededed',
    investigationLabels: [
        'GUS INVESTIGATION P0, GUS INVESTIGATION P1, GUS INVESTIGATION P2, GUS INVESTIGATION P3'
    ],
    investigationLabelColor: 'd4a3f0',
    storyLabel: 'GUS STORY',
    storyLabelColor: 'a2eeef',
    gusUserId: process.env.GUS_USER_ID,
    status: ['INTEGRATE', 'FIXED', 'CLOSED'],
    userStoryRecordTypeId: '0129000000006gDAAQ',
    investigationRecordTypeId: '0129000000006lWAAQ',
    /* Note: bugRecordTypeId is adm_work__c default record type */
    bugRecordTypeId: '012T00000004MUHIA2'
};
