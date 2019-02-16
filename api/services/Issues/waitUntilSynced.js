const retry = require('async/retry');

module.exports = async function waitUntilSynced({ id }, config = {}) {
    const method = async () => {
        const issue = await Issues.findOne({ id });
        if (issue.syncState === 'SYNCED') {
            return issue;
        }
        throw new Error(`Issue ${issue.id} it's not synced yet.`);
    };
    const { times = 5, interval = 1000 } = config;
    return new Promise((resolve) => {
        retry({ times, interval }, method, (error, result) => {
            return resolve(result);
        });
    });
};
