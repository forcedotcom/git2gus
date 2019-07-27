const priorityLevels = ['P0', 'P1', 'P2', 'P3'];

const bugLabelBase = 'GUS';
const investigationLabelBase = 'GUS INVESTIGATION';

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
    storyLabel: 'GUS STORY',
    storyLabelColor: 'a2eeef'
};
module.exports.getBugLabel = getBugLabel;
module.exports.getInvestigationLabel = getInvestigationLabel;
module.exports.bugLabelBase = bugLabelBase;
module.exports.investigationLabelBase = investigationLabelBase;
