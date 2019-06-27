const isGusBugLabel = require('./isGusBugLabel');
const isGusInvestigationLabel = require('./isGusInvestigationLabel');

module.exports = function getPriority(labels) {
    let priority;
    labels.forEach(({ name }) => {
        if (
            isGusBugLabel(name) &&
            (priority === undefined || name[5] < priority[1])
        ) {
            priority = `P${name[5]}`;
        } else if (
            isGusInvestigationLabel(name) &&
            (priority === undefined || name[20] < priority[1])
        ) {
            priority = `P${name[20]}`;
        }
    });
    return priority;
};
