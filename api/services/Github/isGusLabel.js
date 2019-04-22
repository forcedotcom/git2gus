const isGusBugLabel = require('./isGusBugLabel');
const isGusStoryLabel = require('./isGusStoryLabel');

module.exports = function isGusLabel(name) {
    return isGusBugLabel(name) || isGusStoryLabel(name);
};
