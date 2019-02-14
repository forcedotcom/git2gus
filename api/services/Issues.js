const pick = require('lodash/pick');

module.exports = {
    async getAll() {
        return await Issues.find({}).limit(25);
    },
    async create(data) {
        const item = pick(data, [
            'subject',
            'description',
            'productTag',
            'status',
            'foundInBuild',
            'priority',
            'relatedUrl',
        ]);
        return await Issues.create(item).fetch();
    },
    async getById(id) {
        return await Issues.findOne({ id });
    },
    async getByName(name = '') {
        return await Issues.findOne({ name });
    },
    async getByRelatedUrl(relatedUrl) {
        return await Issues.findOne({ relatedUrl });
    },
    async update(id, issue) {
        return await Issues.update({id}, issue).fetch();
    },
    weCreateIssue({ createdById }) {
        return createdById === sails.config.gus.gusUserId;
    },
    getGusItemUrl(item) {
        return `https://gus.lightning.force.com/lightning/r/ADM_Work__c/${item.id}/view`;
    },
};
