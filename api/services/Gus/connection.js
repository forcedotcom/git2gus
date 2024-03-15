const jsforce = require('jsforce');
const logger = require('../../services/Logs/logger');

let connection;
async function getConnection() {
    if (connection) {
        return connection;
    }

    const conn = new jsforce.Connection({ loginUrl : 'https://test.salesforce.com', logLevel: 'DEBUG' });
    try {
        // jsforce connection will auto-refresh if session expires
        await conn.login(process.env.GUS_USERNAME, process.env.GUS_PASSWORD);
        connection = conn;
        return conn;
    } catch (err) {
        logger.error('Error logging into GUS', err);
        throw new Error(`Error logging into GUS ${err.message}`);
    }
}

function getPrefix() {
    return process.env.NAMESPACE_PREFIX
        ? `${process.env.NAMESPACE_PREFIX}__`
        : '';
}

function field(name) {
    return `${getPrefix()}${name}__c`;
}

module.exports = {
    getConnection,
    // TBD: Extract these into a function so it is easily unit testable
    Work: getPrefix() + 'ADM_Work__c',
    Build: getPrefix() + 'ADM_Build__c',
    Changelist: getPrefix() + 'ADM_Change_List__c',
    Epic: getPrefix() + 'ADM_Epic__c',
    prefix: getPrefix(),
    field
};
