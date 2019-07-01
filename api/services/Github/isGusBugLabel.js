module.exports = function isGusBugLabel(name) {
    return sails.config.ghLabels.bugLabels.indexOf(name) !== -1;
};
