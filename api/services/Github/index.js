const getConfig = require('./getConfig');
const createTable = require('./createTable');
const isGusLabel = require('./isGusLabel');
const getPriority = require('./getPriority');
const createComment = require('./createComment');
const addLabels = require('./addLabels');
const getComments = require('./getComments');
const deleteComment = require('./deleteComment');

module.exports = {
    getConfig,
    createTable,
    isGusLabel,
    getPriority,
    createComment,
    addLabels,
    getComments,
    deleteComment
};
