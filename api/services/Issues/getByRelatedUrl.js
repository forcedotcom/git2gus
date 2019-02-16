module.exports = async function getByRelatedUrl(relatedUrl) {
    return await Issues.findOne({ relatedUrl });
};
