/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { EventEmitter, captureRejectionSymbol } = require('events');
const logger = require('../../services/Logs/logger');

const events = {
    INSTALLATION_CREATED: 'INSTALLATION_CREATED',
    INSTALLATION_REPOSITORIES_ADDED: 'INSTALLATION_REPOSITORIES_ADDED',
    LABEL_DELETED: 'LABEL_DELETED',
    ISSUE_LABELED: 'ISSUE_LABELED',
    ISSUE_UNLABELED: 'ISSUE_UNLABELED',
    ISSUE_CLOSED: 'ISSUE_CLOSED',
    ISSUE_EDITED: 'ISSUE_EDITED',
    ISSUE_OPENED: 'ISSUE_OPENED',
    PULL_REQUEST_CLOSED: 'PULL_REQUEST_CLOSED',
    PULL_REQUEST_OPENED: 'PULL_REQUEST_OPENED',
    PULL_REQUEST_LABELED: 'PULL_REQUEST_LABELED',
    PULL_REQUEST_UNLABELED: 'PULL_REQUEST_UNLABELED'
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
    [events.PULL_REQUEST_CLOSED]: {
        event: 'pull_request',
        action: 'closed'
    },
    [events.PULL_REQUEST_OPENED]: {
        event: 'pull_request',
        action: 'opened'
    },
    [events.PULL_REQUEST_LABELED]: {
        event: 'pull_request',
        action: 'labeled'
    },
    [events.PULL_REQUEST_UNLABELED]: {
        event: 'pull_request',
        action: 'unlabeled'
    }
};

class GithubEvents extends EventEmitter {
    constructor() {
        super({ captureRejections: true });
    }

    static match(req, eventName) {
        const event = req.headers['x-github-event'];
        const { action } = req.body;
        return (
            event === eventsConfig[eventName].event &&
            action === eventsConfig[eventName].action
        );
    }

    async emitFromReq(req) {
        const handlerPromises = [];

        Object.keys(eventsConfig).forEach(eventName => {
            if (GithubEvents.match(req, eventName)) {
                logger.info('Request matches eventName', { eventName });
                this.emit(eventName, req, handlerPromises);
            }
        });

        // wait for all handlers to finish, and throw if any rejections
        await Promise.all(handlerPromises);
    }

    // Avoid unhandled promise rejection by logging rejections from event handlers
    [captureRejectionSymbol](err, event, ...unusedArgs) {
        logger.error(`unhandled async error in event ${event}`, err);
    }
}

GithubEvents.events = events;

module.exports = GithubEvents;
