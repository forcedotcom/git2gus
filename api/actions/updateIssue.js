const Github = require('../services/Github');
async function updateIssue(req, body) {
    return await Github.createComment({
        req,
        body
    });
}
exports.updateIssue = updateIssue;
