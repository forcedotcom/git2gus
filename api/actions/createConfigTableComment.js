const GithubEvents = require('../modules/GithubEvents');
const Github = require('./../services/Github');

module.exports = {
    eventName: GithubEvents.events.PULL_REQUEST_EDITED,
    fn: async function (req) {
        const {
            repository,
            number,
        } = req.body;

        const params = {
            owner: repository.owner.login,
            repo: repository.name,
            number,
        };

        try {
            const configObj = await Github.getConfigFromJsonFile({
                ...params,
                octokitClient: req.octokitClient,
            });
            const data = Object.keys(configObj)
                .filter((key, index) => Number(key) !== index)
                .map(key => ({
                    key,
                    value: configObj[key],
                }));
            const columns = [
                { label: 'Key', fieldName: 'key' },
                { label: 'Value', fieldName: 'value' },
            ];
            const message = Github.createTable({
                data,
                columns,
            });

            if (message) {
                return req.octokitClient.issues.createComment({ ...params, body: message });
            }

            return req.octokitClient.issues.createComment({
                ...params,
                body: 'Sorry but the config.json file does not have the right values. You must add the required configuration.',
            });
        } catch (error) {
            if (error.code === 404) {
                return req.octokitClient.issues.createComment({
                    ...params,
                    body: 'Sorry but the config.json file does not exists. You must add it with the required configuration.',
                });
            }
            return req.octokitClient.issues.createComment({
                ...params,
                body: 'Sorry but the config.json file is empty or does not have the right values. You must add the required configuration.',
            });
        }
    }
}
