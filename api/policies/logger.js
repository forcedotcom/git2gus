const os = require('os');
const winston = require('winston');
const LogdnaWinston = require('logdna-winston');
const expressWinston = require('express-winston');

const LOGDNA_INGESTION_KEY = process.env.LOGDNA_INGESTION_KEY;
const env = process.env.NODE_ENV;

const options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        format: winston.format.prettyPrint({ colorize: true })
    },
    logdna: {
        key: LOGDNA_INGESTION_KEY,
        hostname: os.hostname(),
        app: 'Git2Gus',
        env,
        handleExceptions: true
    }
};

const transports = [new winston.transports.Console(options.console)];

if (LOGDNA_INGESTION_KEY) {
    transports.push(new LogdnaWinston(options.logdna));
}

const logger = expressWinston.logger({
    transports,
    requestWhitelist: ['headers', 'query', 'body'],
    responseWhitelist: ['body', 'statusCode'],
    exitOnError: false
});

module.exports = logger;
