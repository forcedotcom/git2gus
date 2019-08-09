const prefix = process.env.SALESFORCE_PREFIX
    ? process.env.SALESFORCE_PREFIX
    : '';

module.exports = {
    tableName: prefix + 'adm_work__c',
    attributes: {
        name: 'string',
        sfid: 'string',
        relatedUrl: {
            type: 'string',
            columnName: prefix + 'related_url__c',
            allowNull: true
        },
        subject: {
            type: 'string',
            columnName: prefix + 'subject__c',
            required: true
        },
        description: {
            type: 'string',
            columnName: prefix + 'details_and_steps_to_reproduce__c',
            allowNull: true
        },
        storyDetails: {
            type: 'string',
            columnName: prefix + 'details__c',
            allowNull: true
        },
        status: {
            type: 'string',
            columnName: prefix + 'status__c'
        },
        createdAt: {
            type: 'ref',
            columnType: 'datetime',
            columnName: 'createddate'
        },
        productTag: {
            type: 'string',
            columnName: prefix + 'product_tag__c',
            required: true
        },
        scrumTeam: {
            type: 'string',
            columnName: prefix + 'scrum_team__c'
        },
        assignee: {
            type: 'string',
            columnName: prefix + 'assignee__c'
        },
        qa_engineer: {
            type: 'string',
            columnName: prefix + 'qa_engineer__c',
            allowNull: true
        },
        productOwner: {
            type: 'string',
            columnName: prefix + 'product_owner__c'
        },
        foundInBuild: {
            type: 'string',
            columnName: prefix + 'found_in_build__c',
            required: true
        },
        priority: {
            type: 'string',
            columnName: prefix + 'priority__c',
            isIn: ['P0', 'P1', 'P2', 'P3'],
            required: false
        },
        syncState: {
            type: 'string',
            columnName: '_hc_lastop',
            allowNull: true
        },
        createdById: {
            type: 'string',
            columnName: 'createdbyid',
            allowNull: true
        },
        recordTypeId: {
            type: 'string',
            columnName: 'RecordTypeId',
            defaultsTo: sails.config.salesforce.bugRecordTypeId,
            isIn: [
                sails.config.salesforce.bugRecordTypeId,
                sails.config.salesforce.userStoryRecordTypeId,
                sails.config.salesforce.investigationRecordTypeId
            ]
        }
    },
    migrate: 'safe'
};
