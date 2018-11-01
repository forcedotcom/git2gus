module.exports = {
    tableName: 'adm_work__c',
    attributes: {
        name: 'string',
        subject: {
            type: 'string',
            required: true,
            columnName: 'subject__c',
        },
        description: {
            type: 'string',
            columnName: 'details_and_steps_to_reproduce__c',
            allowNull: true,
        },
        status: {
            type: 'string',
            columnName: 'status__c',
        },
        createdAt: {
            type: 'ref',
            columnType: 'datetime',
            columnName: 'createddate',
        },
        productTag: {
            type: 'string',
            columnName: 'product_tag__c',
        },
        scrumTeam: {
            type: 'string',
            columnName: 'scrum_team__c',
        },
        assignee: {
            type: 'string',
            columnName: 'assignee__c',
        },
        qa_engineer: {
            type: 'string',
            columnName: 'qa_engineer__c',
        },
        productOwner: {
            type: 'string',
            columnName: 'product_owner__c',
        },
        syncState: {
            type: 'string',
            columnName: '_hc_lastop',
            allowNull: true,
        }
    },
    migrate: 'safe',
}
