module.exports = function isGusInvestigationLabel(name) {
    return sails.config.gus.investigationLabels.indexOf(name) !== -1;
};
