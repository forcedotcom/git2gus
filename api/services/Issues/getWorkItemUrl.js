module.exports = function getWorkItemUrl(item, hideUrl) {
    if (hideUrl) {
        return item.name;
    }

    return `${process.env.WORK_ITEM_BASE_URL + item.sfid}/view`;
};
