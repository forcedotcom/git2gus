const isBugLabel = require('./isBugLabel');
const isUserStoryLabel = require('./isUserStoryLabel');
const isInvestigationLabel = require('./isInvestigationLabel');

module.exports = function isSalesforceLabel(name) {
    return (
        isBugLabel(name) || isUserStoryLabel(name) || isInvestigationLabel(name)
    );
};
