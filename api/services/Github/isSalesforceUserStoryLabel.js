/**
 * Returns true if the label is a Salesforce USER STORY label
 *
 * @param {string} name
 * @returns {boolean}
 */
function isSalesforceUserStoryLabel(name) {
    return sails.config.ghLabels.storyLabel === name;
}

module.exports = isSalesforceUserStoryLabel;
