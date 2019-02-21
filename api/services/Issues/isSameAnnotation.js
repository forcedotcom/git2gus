const getAnnotation = require('./getAnnotation');

module.exports = function isSameAnnotation(prevDescription, nextDescription) {
    const prevMatch = getAnnotation(prevDescription);
    const nextMatch = getAnnotation(nextDescription);
    if (prevMatch === null && nextMatch === null) {
        return false;
    }
    return prevMatch === nextMatch;
};
