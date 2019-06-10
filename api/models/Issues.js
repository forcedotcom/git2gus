module.exports = {
    tableName: 'adm_work__c',
    attributes: {
        name: 'string',
        sfid: 'string',
        relatedUrl: {
            type: 'string',
            columnName: 'related_url__c',
            allowNull: true
        },
        subject: {
            type: 'string',
            columnName: 'subject__c',
            required: true
        },
        description: {
            type: 'string',
            columnName: 'details_and_steps_to_reproduce__c',
            allowNull: true
        },
        storyDetails: {
            type: 'string',
            columnName: 'details__c',
            allowNull: true
        },
        status: {
            type: 'string',
            columnName: 'status__c'
        },
        createdAt: {
            type: 'ref',
            columnType: 'datetime',
            columnName: 'createddate'
        },
        productTag: {
            type: 'string',
            columnName: 'product_tag__c',
            required: true
        },
        scrumTeam: {
            type: 'string',
            columnName: 'scrum_team__c'
        },
        assignee: {
            type: 'string',
            columnName: 'assignee__c'
        },
        qa_engineer: {
            type: 'string',
            columnName: 'qa_engineer__c',
            allowNull: true
        },
        productOwner: {
            type: 'string',
            columnName: 'product_owner__c'
        },
        foundInBuild: {
            type: 'string',
            columnName: 'found_in_build__c',
            required: true
        },
        priority: {
            type: 'string',
            columnName: 'priority__c',
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
            defaultsTo: sails.config.gus.bugRecordTypeId,
            isIn: [
                sails.config.gus.bugRecordTypeId,
                sails.config.gus.userStoryRecordTypeId
            ]
        }
    },
    migrate: 'safe'
};
