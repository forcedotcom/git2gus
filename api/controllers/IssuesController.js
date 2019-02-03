const Issues = require('./../services/Issues');

module.exports = {
    async getAll(req, res) {
        const issues = await Issues.getAll();
        return res.json(issues);
    },
    async create(req, res) {
        try {
            const issue = await Issues.create(req.body);
            return res.json(issue);
        } catch(err) {
            return res.serverError(err);
        }
    },
    async getById(req, res) {
        try {
            const issue = await Issues.getById(req.params.id);
            return res.json(issue);
        } catch(err) {
            console.error(err);
            try {
                const issue = await Issues.getByName(req.params.id);
                return res.json(issue);
            } catch(err) {
                console.error(err);
                return res.notFound(err);
            }
        }
    },
    async getByName(req, res) {
        const issue = await Issues.getByName(req.params.name);
        return res.json(issue);
    },
    async getByRelatedUrl(req, res) {
        const issue = await Issues.getByRelatedUrl(req.params.relatedUrl);
        return res.json(issue);
    },
    async update(req, res) {
        const issue = await Issues.update(req.params.id, req.body);
        return res.json(issue);
    }
};
