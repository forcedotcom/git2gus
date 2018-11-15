const EventEmitter = require('events');

const events = {
    INSTALLATION_CREATED: 'INSTALLATION_CREATED',
    LABEL_DELETED: 'LABEL_DELETED',
}

const eventsConfig = {
    [events.INSTALLATION_CREATED]: {
        event: 'installation',
        action: 'created',
    },
    [events.LABEL_DELETED]: {
        event: 'label',
        action: 'deleted',
    }
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
