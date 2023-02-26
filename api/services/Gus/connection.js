const jsforce = require('jsforce');
const logger = require('../../services/Logs/logger');

let connection;
async function getConnection() {
    if (connection) {
        return connection;
    }

    const conn = new jsforce.Connection({ logLevel: 'DEBUG' });
    try {
        await conn.login(process.env.GUS_USERNAME, process.env.GUS_PASSWORD);
        connection = conn;

        // Keep connection open, but do reconnect every so often
        setTimeout(() => {
            connection = null;
            logger.info(`Forgetting Gus session`);
        }, 10 * 60 * 1000); // 10 minutes

        return conn;
    } catch (err) {
        logger.error('Error logging into GUS', err);
        throw new Error(`Error logging into GUS ${err.message}`);
    }
}

const NAMESPACE_PREFIX = process.env.NAMESPACE_PREFIX
    ? `${process.env.NAMESPACE_PREFIX}__`
    : '';

function field(name) {
    return `${NAMESPACE_PREFIX}${name}__c`;
}

module.exports = {
    getConnection,
    Work: NAMESPACE_PREFIX + 'ADM_Work__c',
    Build: NAMESPACE_PREFIX + 'ADM_Build__c',
    Changelist: NAMESPACE_PREFIX + 'ADM_Changelist__c',
    prefix: NAMESPACE_PREFIX,
    field
};
