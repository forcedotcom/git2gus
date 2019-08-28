/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getRecordTypeId = require('../getRecordTypeId');
const { salesforce } = require('../../../../config/salesforce');
const { ghLabels } = require('../../../../config/ghLabels');
const Github = require('../index');

jest.mock('..', () => ({
    isUserStoryLabel: jest.fn(),
    isInvestigationLabel: jest.fn(),
    isBugLabel: jest.fn()
}));

global.sails = {
    config: {
        salesforce,
        ghLabels
    }
};

describe('getRecordTypeId github service', () => {
    it('should return investigation recordTypeId when investigation label present', () => {
        Github.isInvestigationLabel.mockReturnValue(true);
        Github.isUserStoryLabel.mockReturnValue(true);
        Github.isBugLabel.mockReturnValue(true);
        const labels = [
            { name: 'BUG P2' },
            { name: 'bug' },
            { name: 'USER STORY' },
            { name: 'BUG P1' },
            { name: 'INVESTIGATION P1' }
        ];
        expect(getRecordTypeId(labels)).toBe(
            salesforce.investigationRecordTypeId
        );
    });
    it('should return bug recordTypeId when bug label but no story label present', () => {
        Github.isUserStoryLabel.mockReturnValue(false);
        Github.isBugLabel.mockReturnValue(true);
    });
    it('should return bug recordTypeId when bug label but no story or investigation label present', () => {
        Github.isInvestigationLabel.mockReturnValue(false);
        Github.isUserStoryLabel.mockReturnValue(false);
        Github.isBugLabel.mockReturnValue(true);
        const labels = [
            { name: 'BUG P2' },
            { name: 'bug' },
            { name: 'BUG P1' }
        ];
        expect(getRecordTypeId(labels)).toBe(salesforce.bugRecordTypeId);
    });
    it('should return undefined when an empty array is passed', () => {
        expect(getRecordTypeId([])).toBeUndefined();
    });
    it('should return undefined when an array with not Salesforce labels is passed', () => {
        const labels = [
            { name: 'chore' },
            { name: 'bug' },
            { name: 'refactor' }
        ];
        Github.isUserStoryLabel.mockReturnValue(false);
        Github.isBugLabel.mockReturnValue(false);
        Github.isInvestigationLabel.mockReturnValue(false);
        expect(getRecordTypeId(labels)).toBeUndefined();
    });
});
