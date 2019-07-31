const isBugLabel = require('./isBugLabel');
const isInvestigationLabel = require('./isInvestigationLabel');
const { bugLabelBase } = require('../../../config/ghLabels');
const { investigationLabelBase } = require('../../../config/ghLabels');

const bugPriorityLocation = bugLabelBase.length + 2;
const investigationPriorityLocation = investigationLabelBase.length + 2;

module.exports = function getPriority(labels) {
    let priority;
    labels.forEach(({ name }) => {
        if (
            isBugLabel(name) &&
            (priority === undefined || name[bugPriorityLocation] < priority[1])
        ) {
            priority = `P${name[bugPriorityLocation]}`;
        } else if (
            isInvestigationLabel(name) &&
            (priority === undefined ||
                name[investigationPriorityLocation] < priority[1])
        ) {
            priority = `P${name[investigationPriorityLocation]}`;
        }
    });
    return priority;
};
