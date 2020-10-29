const os = require('os');
const winston = require('winston');
const LogdnaWinston = require('logdna-winston');
const { Client } = require('@elastic/elasticsearch');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const ELASTICSEARCH_ENDPOINT = process.env.ELASTICSEARCH_ENDPOINT;
const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME;
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;
const LOGDNA_INGESTION_KEY = process.env.LOGDNA_INGESTION_KEY;
const env = process.env.NODE_ENV;

const transports = [
    new winston.transports.Console({
        level: 'info',
        handleExceptions: true,
        format: winston.format.prettyPrint({ colorize: true })
    })
];

if (LOGDNA_INGESTION_KEY) {
    transports.push(
        new LogdnaWinston({
            key: LOGDNA_INGESTION_KEY,
            hostname: os.hostname(),
            app: 'Git2Gus',
            env,
            handleExceptions: true
        })
    );
}

if (
    ELASTICSEARCH_ENDPOINT &&
    ELASTICSEARCH_USERNAME &&
    ELASTICSEARCH_PASSWORD
) {
    const client = new Client({
        node: ELASTICSEARCH_ENDPOINT,
        auth: {
            username: 'elastic',
            password: 'TRZoZDY3MD1iEAhsxI4Tka9b'
        }
    });
    const esTransportOpts = {
        level: 'info',
        client
    };
    const esTransport = new ElasticsearchTransport(esTransportOpts);
    transports.push(esTransport);
}

module.exports = transports;
