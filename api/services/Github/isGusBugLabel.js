module.exports = function isGusBugLabel(name) {
    return sails.config.gus.bugLabels.indexOf(name) !== -1;
};
