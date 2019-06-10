const getConfig = require('./getConfig');
const createTable = require('./createTable');
const isGusLabel = require('./isGusLabel');
const isGusBugLabel = require('./isGusBugLabel');
const isGusStoryLabel = require('./isGusStoryLabel');
const getPriority = require('./getPriority');
const createComment = require('./createComment');
const addLabels = require('./addLabels');
const getComments = require('./getComments');
const deleteComment = require('./deleteComment');
const getRecordTypeId = require('./getRecordTypeId');

module.exports = {
    getConfig,
    createTable,
    isGusLabel,
    isGusBugLabel,
    isGusStoryLabel,
    getPriority,
    createComment,
    addLabels,
    getComments,
    deleteComment,
    getRecordTypeId
};
