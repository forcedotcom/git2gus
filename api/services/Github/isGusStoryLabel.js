/**
 * Returns true if the label is a GUS USER STORY label
 *
 * @param {string} name
 * @returns {boolean}
 */
function isGusStoryLabel(name) {
    return sails.config.ghLabels.storyLabel === name;
}

module.exports = isGusStoryLabel;