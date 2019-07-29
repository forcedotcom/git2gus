/**
 * Returns true if the label is a Salesforce USER STORY label
 *
 * @param {string} name
 * @returns {boolean}
 */
function isUserStoryLabel(name) {
    return sails.config.ghLabels.userStoryLabel === name;
}

module.exports = isUserStoryLabel;
