module.exports = {
    tableName: 'adm_build__c',
    attributes: {
        name: 'string',
        createdAt: {
            type: 'ref',
            columnType: 'datetime',
            columnName: 'createddate',
        },
        endsAt: {
            type: 'ref',
            columnType: 'datetime',
            columnName: 'release_freeze_datetime__c',
        },
        sfid: 'string',
    },
    migrate: 'safe',
};
