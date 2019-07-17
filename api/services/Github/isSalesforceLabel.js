const isGusBugLabel = require('./isSalesforceBugLabel');
const isGusStoryLabel = require('./isSalesforceUserStoryLabel');

module.exports = function isGusLabel(name) {
    return isGusBugLabel(name) || isGusStoryLabel(name);
};
