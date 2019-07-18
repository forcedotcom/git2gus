module.exports = function getWorkItemUrl(item) {
    return `${process.env.WORK_ITEM_BASE_URL + item.sfid}/view`;
};
