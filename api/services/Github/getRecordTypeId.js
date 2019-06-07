// @ts-check
const isGusStoryLabel = require('./isGusStoryLabel');

/**
 * @typedef {import('../../models/Issues')} Issues
 * @typedef {global & {sails: any}} TypedGlobal
 * @typedef {import("@octokit/rest").IssuesGetEventResponseIssueLabelsItem} Label
 */

/**
 * Gets the RecordTypeId based on the labels. USER STORY label takes precedence
 * over BUG labels.
 *
 * @param {Label[]} labels
 * @returns {string}
 */
function getRecordTypeId(labels) {
    const hasStoryLabel = labels.some(l => isGusStoryLabel(l.name));

    if (hasStoryLabel) {
        return /** @type{TypedGlobal} */ (global).sails.config.gus
            .userStoryRecordTypeId;
    }
    return /** @type{TypedGlobal} */ (global).sails.config.gus.bugRecordTypeId;
}

module.exports = getRecordTypeId;
