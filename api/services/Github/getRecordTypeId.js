// @ts-check
const isUserStoryLabel = require('./isUserStoryLabel');
const isBugLabel = require('./isBugLabel');
const isInvestigationLabel = require('./isInvestigationLabel');

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
    if (labels.some(l => isUserStoryLabel(l.name))) {
        return /** @type{TypedGlobal} */ (global).sails.config.salesforce
            .userStoryRecordTypeId;
    }
    if (labels.some(l => isInvestigationLabel(l.name))) {
        return /** @type{TypedGlobal} */ (global).sails.config.gus
            .investigationRecordTypeId;
    }

    if (labels.some(l => isBugLabel(l.name))) {
        return /** @type{TypedGlobal} */ (global).sails.config.salesforce
            .bugRecordTypeId;
    }

    return undefined;
}

module.exports = getRecordTypeId;
