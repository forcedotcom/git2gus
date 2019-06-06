// @ts-check
const isGusStoryLabel = require('./isGusStoryLabel');

/**
 * @typedef {import('../../models/Issues')} Issues
 * @typedef {global & {Issues: Issues}} TypedGlobal
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
    return labels.some(l => isGusStoryLabel(l.name))
        ? /** @type{TypedGlobal} */ (global).Issues.USER_STORY_RECORDTYPEID
        : /** @type{TypedGlobal} */ (global).Issues.BUG_RECORDTYPEID;
}

module.exports = getRecordTypeId;
