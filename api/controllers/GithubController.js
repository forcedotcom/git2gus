module.exports = {
    async processEvent(req, res) {
        sails.config.ghEvents.emitFromReq(req);
        return res.send({
            code: 'OK',
        });
    }
};
