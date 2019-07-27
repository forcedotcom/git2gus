module.exports = function isGusInvestigationLabel(name) {
    return sails.config.ghLabels.investigationLabels.indexOf(name) !== -1;
};
