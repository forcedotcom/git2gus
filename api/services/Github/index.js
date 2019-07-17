const getConfig = require('./getConfig');
const createTable = require('./createTable');
const isSalesforceLabel = require('./isSalesforceLabel');
const isSalesforceBugLabel = require('./isSalesforceBugLabel');
const isSalesforceUserStoryLabel = require('./isSalesforceUserStoryLabel');
const getPriority = require('./getPriority');
const createComment = require('./createComment');
const addLabels = require('./addLabels');
const getComments = require('./getComments');
const deleteComment = require('./deleteComment');
const getRecordTypeId = require('./getRecordTypeId');

module.exports = {
    getConfig,
    createTable,
    isSalesforceLabel,
    isSalesforceBugLabel,
    isSalesforceUserStoryLabel,
    getPriority,
    createComment,
    addLabels,
    getComments,
    deleteComment,
    getRecordTypeId
};
