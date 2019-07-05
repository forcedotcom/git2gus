const EventEmitter = require('events');

const events = {
    INSTALLATION_CREATED: 'INSTALLATION_CREATED',
    INSTALLATION_REPOSITORIES_ADDED: 'INSTALLATION_REPOSITORIES_ADDED',
    LABEL_DELETED: 'LABEL_DELETED',
    ISSUE_LABELED: 'ISSUE_LABELED',
    ISSUE_UNLABELED: 'ISSUE_UNLABELED',
    ISSUE_CLOSED: 'ISSUE_CLOSED',
    ISSUE_EDITED: 'ISSUE_EDITED',
    ISSUE_OPENED: 'ISSUE_OPENED',
    ISSUE_COMMENT_CREATED: 'ISSUE_COMMENT_CREATED',
    ISSUE_COMMENT_EDITED: 'ISSUE_COMMENT_EDITED',
    ISSUE_COMMENT_DELETED: 'ISSUE_COMMENT_DELETED'
};

const eventsConfig = {
    [events.INSTALLATION_CREATED]: {
        event: 'installation',
        action: 'created'
    },
    [events.INSTALLATION_REPOSITORIES_ADDED]: {
        event: 'installation_repositories',
        action: 'added'
    },
    [events.LABEL_DELETED]: {
        event: 'label',
        action: 'deleted'
    },
    [events.ISSUE_LABELED]: {
        event: 'issues',
        action: 'labeled'
    },
    [events.ISSUE_UNLABELED]: {
        event: 'issues',
        action: 'unlabeled'
    },
    [events.ISSUE_CLOSED]: {
        event: 'issues',
        action: 'closed'
    },
    [events.ISSUE_EDITED]: {
        event: 'issues',
        action: 'edited'
    },
    [events.ISSUE_OPENED]: {
        event: 'issues',
        action: 'opened'
    },
    [events.ISSUE_COMMENT_CREATED]: {
        event: 'issue_comment',
        action: 'created'
    },
    [events.ISSUE_COMMENT_EDITED]: {
        event: 'issue_comment',
        action: 'edited'
    },
    [events.ISSUE_COMMENT_DELETED]: {
        event: 'issue_comment',
        action: 'deleted'
    }
};

class GithubEvents extends EventEmitter {
    static match(req, eventName) {
        const event = req.headers['x-github-event'];
        const { action } = req.body;
        return (
            event === eventsConfig[eventName].event &&
            action === eventsConfig[eventName].action
        );
    }

    emitFromReq(req) {
        Object.keys(eventsConfig).forEach(eventName => {
            if (GithubEvents.match(req, eventName)) {
                this.emit(eventName, req);
            }
        });
    }
}

GithubEvents.events = events;

module.exports = GithubEvents;
