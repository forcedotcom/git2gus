module.exports = function isWorkItemClosed(status) {
    return sails.config.gus.status.indexOf(status) !== -1;
};
