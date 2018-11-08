const EventEmitter = require('events');

const events = {
    PULL_REQUEST_OPENED: 'PULL_REQUEST_OPENED',
    PULL_REQUEST_EDITED: 'PULL_REQUEST_EDITED',
}

const eventsConfig = {
    [events.PULL_REQUEST_OPENED]: {
        event: 'pull_request',
        action: 'opened',
    },
    [events.PULL_REQUEST_EDITED]: {
        event: 'pull_request',
        action: 'edited',
    },
}

class GithubEvents extends EventEmitter {
    emitFromReq(req) {
        const event = req.headers['x-github-event'];
        const action = req.body.action;
        Object.keys(eventsConfig).forEach((eventName) => {
            if (event === eventsConfig[eventName].event && action === eventsConfig[eventName].action) {
                this.emit(eventName, req);
            }
        });
    }
};

GithubEvents.events = events;

module.exports = GithubEvents;
