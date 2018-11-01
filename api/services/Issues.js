const pick = require('lodash/pick');

module.exports = {
    async getAll() {
        return await Issues.find({}).limit(10);
    },
    async create(data) {
        const item = pick(data, [
            'subject',
            'description',
            'productTag',
            'status',
        ]);
        return await Issues.create(item).fetch();
    },
    async get(id) {
        return await Issues.findOne({id});
    },
    async update(id, issue) {
        return await Issues.update({id}, issue).fetch();
    }
};
