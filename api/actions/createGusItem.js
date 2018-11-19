const GithubEvents = require('../modules/GithubEvents');
const Issues = require('../services/Issues');
const Builds = require('../services/Builds');

let prevIssueEvent = {};

function isGusLabel(name) {
    return sails.config.gus.labels.indexOf(name) !== -1;
}

function isBuildLabel(name, config) {
    return config.builds.some(build => String(build) === name);
}

function resolveDataFromLabels(labels, config) {
    let priority;
    let build;
    labels.forEach(({ name }) => {
        if (isGusLabel(name) && (priority === undefined || name[5] < priority[1])) {
            priority = `P${name[5]}`;
        }
        if (isBuildLabel(name, config) && (build === undefined || name < build)) {
            build = name;
        }
    });
    return {
        priority,
        build,
    };
}

module.exports = {
    eventName: [GithubEvents.events.ISSUE_LABELED, GithubEvents.events.ISSUE_UNLABELED],
    fn: async function (req) {
        const {
            issue: { labels, url, title, body, id, updated_at },
        } = req.body;
        const { config } = req.git2gus;

        const currentIssueEvent = {
            id,
            updated_at,
        };

        if (prevIssueEvent.id === currentIssueEvent.id && prevIssueEvent.updated_at === currentIssueEvent.updated_at) {
            return;
        }
        prevIssueEvent = currentIssueEvent;

        const { priority, build } = resolveDataFromLabels(labels, config);

        let buildFromDb;
        if (build) {
            buildFromDb = await Builds.getBuildByName(build);
        }
        if (!build || !buildFromDb) {
            buildFromDb = await Builds.getBuildByName(config.defaultBuild);
        }

        const foundInBuild = buildFromDb && buildFromDb.sfid;
        const hasRightData = priority && foundInBuild;

        if (hasRightData) {
            const issue = await Issues.getByRelatedUrl(url);
            if (issue) {
                return Issues.update(issue.id, { priority, foundInBuild });
            }
            return Issues.create({
                subject: title,
                description: body,
                productTag: config.productTag,
                status: 'NEW',
                foundInBuild,
                priority,
                relatedUrl: url,
            });
        }
    }
}
