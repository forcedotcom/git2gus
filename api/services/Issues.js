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
            'productTag',
            'foundInBuild',
            'priority',
        ]);
        return await Issues.create(item).fetch();
    },
    async getById(id) {
        return await Issues.findOne({ id });
    },
    async getByName(name = '') {
        return await Issues.findOne({ name });
    },
    async update(id, issue) {
        return await Issues.update({id}, issue).fetch();
    }
};
