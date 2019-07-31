const getConfig = require('./getConfig');
const createTable = require('./createTable');
const isSalesforceLabel = require('./isSalesforceLabel');
const isBugLabel = require('./isBugLabel');
const isUserStoryLabel = require('./isUserStoryLabel');
const isInvestigationLabel = require('./isInvestigationLabel');
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
    isBugLabel,
    isUserStoryLabel,
    isInvestigationLabel,
    getPriority,
    createComment,
    addLabels,
    getComments,
    deleteComment,
    getRecordTypeId
};
