const pick = require('lodash/pick');

module.exports = async function create(data) {
    const item = pick(data, [
        'subject',
        'description',
        'storyDetails',
        'productTag',
        'status',
        'foundInBuild',
        'priority',
        'relatedUrl'
    ]);
    return await Issues.create(item).fetch();
};
