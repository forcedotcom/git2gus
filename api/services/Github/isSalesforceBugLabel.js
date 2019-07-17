module.exports = function isSalesforceBugLabel(name) {
    return sails.config.ghLabels.bugLabels.indexOf(name) !== -1;
};
