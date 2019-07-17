module.exports = function getWorkItemUrl(item) {
    return `https://gus.lightning.force.com/lightning/r/ADM_Work__c/${
        item.sfid
    }/view`;
};
