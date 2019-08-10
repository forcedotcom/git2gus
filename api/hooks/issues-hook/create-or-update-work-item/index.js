const Issues = require('../../../services/Issues');
const Logger = require('../../../services/Logger');

module.exports = async function createOrUpdateWorkItem(task) {
    const {
        subject,
        description,
        storyDetails,
        productTag,
        status,
        foundInBuild,
        priority,
        relatedUrl,
        recordTypeId
    } = task;

    Logger.log('Looking if issue already exists....' + relatedUrl);

    const issue = await Issues.getByRelatedUrl(relatedUrl);
    const alreadyLowestPriority =
        issue && issue.priority !== '' && issue.priority <= priority;
    const recordIdTypeIsSame = issue && issue.recordTypeId === recordTypeId;

    // if issue already exists and already has lowest priority
    // and already has correct recordTypeId then we just return
    if (alreadyLowestPriority && recordIdTypeIsSame) {
        Logger.log('Already lowest priority');
        return;
    }

    // else if issue already exists we update it
    if (issue) {
        Logger.log('Update existing work item' + issue.id);
        return await Issues.update(issue.id, { priority, recordTypeId });
    }

    Logger.log('Creating new work item' + relatedUrl);
    // else we create a new issue
    return await Issues.create({
        subject,
        description,
        storyDetails,
        productTag,
        status,
        foundInBuild,
        priority,
        relatedUrl,
        recordTypeId
    });
};
