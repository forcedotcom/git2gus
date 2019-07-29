module.exports = function isWorkItemClosed(status) {
    return sails.config.salesforce.status.indexOf(status) !== -1;
};
