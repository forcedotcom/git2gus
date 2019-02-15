module.exports = function isGusLabel(name) {
    return sails.config.gus.labels.indexOf(name) !== -1;
};
