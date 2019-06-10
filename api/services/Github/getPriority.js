const isGusBugLabel = require('./isGusBugLabel');

module.exports = function getPriority(labels) {
    let priority;
    labels.forEach(({ name }) => {
        if (
            isGusBugLabel(name) &&
            (priority === undefined || name[5] < priority[1])
        ) {
            priority = `P${name[5]}`;
        }
    });
    return priority;
};
