// @ts-check
const isGusStoryLabel = require('./isSalesforceUserStoryLabel');
const isGusBugLabel = require('./isSalesforceBugLabel');

/**
 * @typedef {import('../../models/Issues')} Issues
 * @typedef {global & {sails: any}} TypedGlobal
 * @typedef {import("@octokit/rest").IssuesGetEventResponseIssueLabelsItem} Label
 */

/**
 * Gets the RecordTypeId based on the labels. USER STORY label takes precedence
 * over BUG labels. If no Story or Bug labels are present undefined is returned.
 *
 * @param {Label[]} labels
 * @returns {string}
 */
function getRecordTypeId(labels) {
    if (labels.some(l => isGusStoryLabel(l.name))) {
        return /** @type{TypedGlobal} */ (global).sails.config.gus
            .userStoryRecordTypeId;
    }

    if (labels.some(l => isGusBugLabel(l.name))) {
        return /** @type{TypedGlobal} */ (global).sails.config.gus
            .bugRecordTypeId;
    }

    return undefined;
}

module.exports = getRecordTypeId;
