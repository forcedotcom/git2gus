module.exports = function getAnnotation(description) {
    if (typeof description === 'string') {
        const matches = description.match(/@w-\d+@/gi);
        if (Array.isArray(matches) && matches.length > 0) {
            return matches[0].replace(/@/g, '');
        }
        return null;
    }
    return null;
};
