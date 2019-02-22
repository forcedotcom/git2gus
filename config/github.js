module.exports.github = {
    secret: process.env.GITHUB_WEBHOOK_SECRET,
    appId: process.env.GITHUB_APP_ID,
    installationEvents: [
        'installation',
        'integration_installation',
        'integration_installation_repositories',
        'installation_repositories',
    ],
};
