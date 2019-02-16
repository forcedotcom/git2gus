module.exports = function weCreateIssue({ createdById }) {
    return createdById === sails.config.gus.gusUserId;
};
