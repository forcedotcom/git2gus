module.exports = function isBugLabel(name) {
    return sails.config.ghLabels.bugLabels.indexOf(name) !== -1;
};
