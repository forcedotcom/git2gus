module.exports = function isGusStoryLabel(name) {
    return sails.config.gus.storyLabel === name;
};
