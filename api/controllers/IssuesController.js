const Issues = require('./../services/Issues');

module.exports = {
    async getAll(req, res) {
        const issues = await Issues.getAll();
        return res.json(issues);
    },
    async create(req, res) {
        const issue = await Issues.create(req.body);
        return res.json(issue);
    },
    async get(req, res) {
        const issue = await Issues.get(req.params.id);
        return res.json(issue);
    },
    async update(req, res) {
        const issue = await Issues.update(req.params.id, req.body);
        return res.json(issue);
    }
}
