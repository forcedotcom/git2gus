const isGusBugLabel = require('./isGusBugLabel');
const isGusInvestigationLabel = require('./isGusInvestigationLabel');
const { bugLabelBase } = require('../../../config/ghLabels');
const { investigationLabelBase } = require('../../../config/ghLabels');

const bugPriorityLocation = bugLabelBase.length + 2;
const investigationPriorityLocation = investigationLabelBase.length + 2;

module.exports = function getPriority(labels) {
    let priority;
    labels.forEach(({ name }) => {
        if (
            isGusBugLabel(name) &&
            (priority === undefined || name[bugPriorityLocation] < priority[1])
        ) {
            priority = `P${name[bugPriorityLocation]}`;
        } else if (
            isGusInvestigationLabel(name) &&
            (priority === undefined ||
                name[investigationPriorityLocation] < priority[1])
        ) {
            priority = `P${name[investigationPriorityLocation]}`;
        }
    });
    return priority;
};
