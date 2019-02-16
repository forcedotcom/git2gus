const pick = require('lodash/pick');

module.exports = async function create(data) {
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
};
