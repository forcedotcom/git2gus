const isSalesforceBugLabel = require('./isSalesforceBugLabel');
const isSalesforceUserStoryLabel = require('./isSalesforceUserStoryLabel');

module.exports = function isSalesforceLabel(name) {
    return isSalesforceBugLabel(name) || isSalesforceUserStoryLabel(name);
};
