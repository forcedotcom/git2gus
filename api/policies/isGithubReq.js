const verify = require('@octokit/webhooks/verify');
const secret = process.env.GITHUB_WEBHOOK_SECRET;

module.exports = function isGithubReq(req, res, next) {
    const signature = req.headers['x-hub-signature'];
    const payload = req.body;
    if (secret && payload && signature
        && verify(secret, payload, signature)) {
        return next();
    }
    return res.badRequest({
        code: 'BAD_GITHUB_REQUEST',
        message: 'Wrong event payload received.',
    });
};
