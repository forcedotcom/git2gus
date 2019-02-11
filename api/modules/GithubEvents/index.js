const EventEmitter = require('events');
const Logger = require('../../services/Logger');

const events = {
    INSTALLATION_CREATED: 'INSTALLATION_CREATED',
    LABEL_DELETED: 'LABEL_DELETED',
    ISSUE_LABELED: 'ISSUE_LABELED',
    ISSUE_UNLABELED: 'ISSUE_UNLABELED',
    ISSUE_CLOSED: 'ISSUE_CLOSED',
    ISSUE_EDITED: 'ISSUE_EDITED',
};

const eventsConfig = {
    [events.INSTALLATION_CREATED]: {
        event: 'installation',
        action: 'created',
    },
    [events.LABEL_DELETED]: {
        event: 'label',
        action: 'deleted',
    },
    [events.ISSUE_LABELED]: {
        event: 'issues',
        action: 'labeled',
    },
    [events.ISSUE_UNLABELED]: {
        event: 'issues',
        action: 'unlabeled',
    },
    [events.ISSUE_CLOSED]: {
        event: 'issues',
        action: 'closed',
    },
    [events.ISSUE_EDITED]: {
        event: 'issues',
        action: 'edited',
    },
};

class GithubEvents extends EventEmitter {
    emitFromReq(req) {
        const event = req.headers['x-github-event'];
        const action = req.body.action;
        Object.keys(eventsConfig).forEach((eventName) => {
            if (event === eventsConfig[eventName].event && action === eventsConfig[eventName].action) {
                Logger.log({
                    message: `${event.toUpperCase()} ${action.toUpperCase()} emited`,
                });
                this.emit(eventName, req);
            }
        });
    }
}

GithubEvents.events = events;

module.exports = GithubEvents;
