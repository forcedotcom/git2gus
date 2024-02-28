/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { field, Work, Build, Changelist } = require('../connection');

const defaultPrefix = process.env.NAMESPACE_PREFIX;
const mockPrefix = 'mock_prefix';
describe('connection configuration when namespace is not empty', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = {
            NAMESPACE_PREFIX: mockPrefix
        };
    });
    it('should have field configurations with prefix', async () => {
        expect(field('something')).toBe(mockPrefix + '__something__c');
    });
});

describe('connection configuration when namespace is default (empty)', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = {
            NAMESPACE_PREFIX: defaultPrefix
        };
    });
    it('should field configurations without prefix', async () => {
        expect(field('something')).toBe('something__c');
    });
    it('should have Work without prefix', async () => {
        expect(Work).toBe('ADM_Work__c');
    });
    it('should have Build without prefix', async () => {
        expect(Build).toBe('ADM_Build__c');
    });
    it('should have Work without prefix', async () => {
        expect(Changelist).toBe('ADM_Change_List__c');
    });
});
