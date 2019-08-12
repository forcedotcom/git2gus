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
