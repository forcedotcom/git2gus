module.exports = {
    async processEvent(req, res) {
        sails.config.ghEvents.emitFromReq(req);
        return res.ok({
            status: 'OK'
        });
    }
};
