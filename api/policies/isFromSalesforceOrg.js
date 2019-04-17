const { github } = require('../../config/github');

module.exports = function isSalesforceReq(req, res, next) {
    const { repository, installation } = req.body;
    const event = req.headers['x-github-event'];
    const isSalesforceInstallation =
        github.installationEvents.indexOf(event) !== -1 &&
        installation.account &&
        installation.account.login === 'salesforce';
    const isEventFromSalesforce =
        repository && repository.owner.login === 'salesforce';

    const isFromDevelopmentGithubRepo =
        process.env.NODE_ENV === 'development' &&
        process.env.GITHUB_TEST_ORG &&
        repository &&
        repository.owner.login === process.env.GITHUB_TEST_ORG;

    if (
        isSalesforceInstallation ||
        isEventFromSalesforce ||
        isFromDevelopmentGithubRepo
    ) {
        return next();
    }
    return res.badRequest({
        code: 'BAD_GITHUB_REQUEST',
        message: 'The request received is not from salesforce org.'
    });
};
