const isBugLabel = require('./isBugLabel');
const isUserStoryLabel = require('./isUserStoryLabel');

module.exports = function isSalesforceLabel(name) {
    return isBugLabel(name) || isUserStoryLabel(name);
};
