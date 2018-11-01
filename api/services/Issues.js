const pick = require('lodash/pick');

module.exports = {
    async getAll() {
        return await Issues.find({}).limit(10);
    },
    async create(data) {
        const item = pick(data, [
            'subject',
            'decription',
            'productTag',
            'status',
        ]);
        return await Issues.create(item).fetch();
    },
    async get(id) {
        return await Issues.findOne({ id });
    }
}
