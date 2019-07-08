const { github } = require('../../config/github');

const orgsRegex = [/^salesforce$/i, /^sfdc$/i, /^forcedotcom$/i];

function isSalesforceOrg(name) {
    return orgsRegex.some(regex => {
        return regex.test(name);
    });
}

module.exports = function isSalesforceReq(req, res, next) {
    const { repository, installation } = req.body;
    const event = req.headers['x-github-event'];
    const isSalesforceInstallation =
        github.installationEvents.indexOf(event) !== -1 &&
        installation.account &&
        isSalesforceOrg(installation.account.login);
    const isEventFromSalesforce =
        repository && isSalesforceOrg(repository.owner.login);

    const isFromDevelopmentGithubRepo =
        process.env.NODE_ENV === 'development' &&
        process.env.GITHUB_TEST_ORG &&
        ((repository &&
            repository.owner.login === process.env.GITHUB_TEST_ORG) ||
            (installation.account &&
                installation.account.login === process.env.GITHUB_TEST_ORG));

    if (
        isSalesforceInstallation ||
        isEventFromSalesforce ||
        isFromDevelopmentGithubRepo
    ) {
        return next();
    }
    return res.badRequest({
        status: 'BAD_GITHUB_REQUEST',
        message: 'The request received is not from salesforce org.'
    });
};
