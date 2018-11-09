const GithubEvents = require('../modules/GithubEvents');
const Github = require('./../services/Github');

const typesMap = {
    fix: 'bug',
    feat: 'story',
    chore: 'chore',
    test: 'test',
    docs: 'docs',
};
const TYPE_REGEX = /^(fix|feat|chore|test|docs): .+/;

module.exports = {
    eventName: [GithubEvents.events.PULL_REQUEST_OPENED, GithubEvents.events.PULL_REQUEST_EDITED],
    fn: async function (req) {
        const {
            action,
            pull_request: { title },
            number,
            repository,
        } = req.body;

        const params = {
            owner: repository.owner.login,
            repo: repository.name,
            number,
        };
        const matchedType = title.match(TYPE_REGEX);

        if (action === 'edited') {
            await Github.removeConventionalLabels({
                ...params,
                octokitClient: req.octokitClient,
            });
        }

        if (matchedType) {
            const label = typesMap[matchedType[1]];
            return req.octokitClient.issues.addLabels({ ...params, labels: [label] });
        }

        return req.octokitClient.issues.createComment({
            ...params,
            body: 'Sorry but the PR title don\'t follow conventional commit rules. See: https://www.conventionalcommits.org/en/v1.0.0-beta.2/',
        })
    }
}
