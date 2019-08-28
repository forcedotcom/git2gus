/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const priorityLevels = ['P0', 'P1', 'P2', 'P3'];

const bugLabelBase = 'BUG';
const investigationLabelBase = 'INVESTIGATION';

function getBugLabel(priority) {
    return bugLabelBase + ' ' + priority;
}

function getInvestigationLabel(priority) {
    return investigationLabelBase + ' ' + priority;
}

module.exports.ghLabels = {
    bugLabels: priorityLevels.map(p => getBugLabel(p)),
    investigationLabels: priorityLevels.map(p => getInvestigationLabel(p)),
    investigationLabelColor: 'd4a3f0',
    bugLabelColor: 'ededed',
    userStoryLabel: 'USER STORY',
    userStoryLabelColor: 'a2eeef'
};
module.exports.getBugLabel = getBugLabel;
module.exports.getInvestigationLabel = getInvestigationLabel;
module.exports.bugLabelBase = bugLabelBase;
module.exports.investigationLabelBase = investigationLabelBase;
