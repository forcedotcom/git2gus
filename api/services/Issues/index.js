const getAll = require('./getAll');
const create = require('./create');
const getById = require('./getById');
const getByName = require('./getByName');
const getByRelatedUrl = require('./getByRelatedUrl');
const update = require('./update');
const weCreateIssue = require('./weCreateIssue');
const getWorkItemUrl = require('./getWorkItemUrl');
const waitUntilSynced = require('./waitUntilSynced');
const getAnnotation = require('./getAnnotation');
const isSameAnnotation = require('./isSameAnnotation');

module.exports = {
    getAll,
    create,
    getById,
    getByName,
    getByRelatedUrl,
    update,
    weCreateIssue,
    getWorkItemUrl,
    waitUntilSynced,
    getAnnotation,
    isSameAnnotation
};
