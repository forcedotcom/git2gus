/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getBuildByName = require('../getBuildByName');

global.Builds = {
    findOne: jest.fn()
};

describe('getBuildByName builds service', () => {
    it('should call findOne with the right value', () => {
        getBuildByName('build-35');
        expect(Builds.findOne).toHaveBeenCalledWith({
            name: 'build-35'
        });
    });
});
