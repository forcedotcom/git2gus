const { github } = require('../../config/github');

module.exports = function isSalesforceReq(req, res, next) {
    const {
        repository,
        installation,
    } = req.body;
    const event = req.headers['x-github-event'];
    const isSalesforceInstallation = github.installationEvents.indexOf(event) !== -1
        && installation.account && installation.account.login === 'salesforce';
    const isEventFromSalesforce = repository && repository.owner.login === 'salesforce';

    if (isSalesforceInstallation || isEventFromSalesforce) {
        return next();
    }
    return res.badRequest({
        code: 'BAD_GITHUB_REQUEST',
        message: 'The request received is not from salesforce org.',
    });
};
