const isGusLabel = require('./isGusLabel');

module.exports = function getPriority(labels) {
    let priority;
    labels.forEach(({ name }) => {
        if (isGusLabel(name) && (priority === undefined || name[5] < priority[1])) {
            priority = `P${name[5]}`;
        }
    });
    return priority;
};
