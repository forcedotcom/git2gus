// @ts-check
const isGusInvestigationLabel = require('./isGusInvestigationLabel');
const isGusStoryLabel = require('./isGusStoryLabel');
const isGusBugLabel = require('./isGusBugLabel');

/**
 * @typedef {import('../../models/Issues')} Issues
 * @typedef {global & {sails: any}} TypedGlobal
 * @typedef {import("@octokit/rest").IssuesGetEventResponseIssueLabelsItem} Label
 */

/**
 * Gets the RecordTypeId based on the labels. INVESTIGATION labels take
 * precedence over USER STORY label, which takes precedence over BUG labels. If
 * no Investigation, Story or Bug labels are present undefined is returned.
 *
 * @param {Label[]} labels
 * @returns {string}
 */
function getRecordTypeId(labels) {
    if (labels.some(l => isGusInvestigationLabel(l.name))) {
        return /** @type{TypedGlobal} */ (global).sails.config.gus
            .investigationRecordTypeId;
    }

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
