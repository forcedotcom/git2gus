module.exports = function isInvestigationLabel(name) {
    return sails.config.ghLabels.investigationLabels.indexOf(name) !== -1;
};
