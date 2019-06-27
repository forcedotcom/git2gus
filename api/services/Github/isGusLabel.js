const isGusBugLabel = require('./isGusBugLabel');
const isGusInvestigationLabel = require('./isGusInvestigationLabel');
const isGusStoryLabel = require('./isGusStoryLabel');

module.exports = function isGusLabel(name) {
    return (
        isGusBugLabel(name) ||
        isGusStoryLabel(name) ||
        isGusInvestigationLabel(name)
    );
};
