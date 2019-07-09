const GithubEvents = require('./../api/modules/GithubEvents');
const ghEvents = new GithubEvents();

const actions = require('require-all')({
    dirname: `${__dirname}/../api/actions`,
    filter: /^.+.js$/,
    recursive: false
});

Object.keys(actions).forEach(actionName => {
    const { eventName, fn } = actions[actionName];
    // comment
    if (typeof eventName === 'string') {
        console.log(`attach ${actionName} to ${eventName}`);
        ghEvents.on(eventName, fn);
    }
    if (Array.isArray(eventName)) {
        eventName.forEach(event => {
            console.log(`attach ${actionName} to ${event}`);
            ghEvents.on(event, fn);
        });
    }
});

module.exports.ghEvents = ghEvents;
