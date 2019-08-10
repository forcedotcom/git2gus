const pick = require('lodash/pick');

module.exports = async function create(data) {
    const item = pick(data, [
        'subject',
        'description',
        'productTag',
        'status',
        'foundInBuild',
        'priority',
        'relatedUrl'
    ]);
    console.log('Starting item creation....');
    return await Issues.create(item).fetch();
};
