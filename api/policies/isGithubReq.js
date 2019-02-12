const verify = require('@octokit/webhooks/verify');
const Logger = require('../services/Logger');
const secret = process.env.GITHUB_WEBHOOK_SECRET;

module.exports = function isGithubReq(req, res, next) {
    const signature = req.headers['x-hub-signature'];
    const payload = req.body;
    const requestUrl = `[${req.method}] ${req.path}`;
    Logger.log({
        message: `Request received: ${requestUrl}`,
    });
    if (secret && payload && signature
        && verify(secret, payload, signature)) {
        return next();
    }
    Logger.log({
        type: 'error',
        message: `Invalid Github request ${requestUrl}`,
        event: {
            WRONG_GITHUB_REQUEST: {
                ip: req.ip,
            },
        },
    });
    return res.badRequest({
        code: 'BAD_GITHUB_REQUEST',
        message: 'Wrong event payload received.',
    });
};
