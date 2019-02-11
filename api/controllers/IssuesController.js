const Issues = require('../services/Issues');
const Logger = require('../services/Logger');

function logError(error) {
    return Logger.log({
        type: 'error',
        message: error,
    });
}

module.exports = {
    async getAll(req, res) {
        const issues = await Issues.getAll();
        return res.json(issues);
    },
    async create(req, res) {
        try {
            const issue = await Issues.create(req.body);
            return res.json(issue);
        } catch(error) {
            logError(error);
            return res.serverError(error);
        }
    },
    async getById(req, res) {
        try {
            const issue = await Issues.getById(req.params.id);
            return res.json(issue);
        } catch(error) {
            logError(error);
            try {
                const issue = await Issues.getByName(req.params.id);
                return res.json(issue);
            } catch(error) {
                logError(error);
                return res.notFound(error);
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
