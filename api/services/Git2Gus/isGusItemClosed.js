module.exports = function isGusItemClosed(status) {
    return sails.config.gus.status.indexOf(status) !== -1;
};
