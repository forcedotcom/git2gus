const transports = require('./transports');
const expressWinston = require('express-winston');

const logger = expressWinston.logger({
    transports,
    requestWhitelist: ['headers', 'query', 'body'],
    responseWhitelist: ['body', 'statusCode'],
    exitOnError: false
});

const errorLogger = expressWinston.errorLogger({
    transports
});

module.exports = {
    logger,
    errorLogger
};
