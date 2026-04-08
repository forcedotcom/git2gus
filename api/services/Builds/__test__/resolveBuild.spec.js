/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const resolveBuild = require('../resolveBuild');
const getBuildByName = require('../getBuildByName');

jest.mock('../getBuildByName', () => jest.fn());
const config = {
    defaultBuild: 220
};

describe('resolveBuild builds service', () => {
    let consoleSpy;
    beforeAll(() => {
        consoleSpy = jest.spyOn(console, 'log').mockReturnValue();
    });
    afterAll(() => {
        consoleSpy.mockRestore();
    });
    it('should call getBuildByName with the right value when a milsetone is passed', async () => {
        const milestone = {
            title: 218
        };
        await resolveBuild(config, milestone);
        expect(getBuildByName).toHaveBeenCalledWith(218);
    });
    it('should call getBuildByName with the right value when a milsetone is not passed', async () => {
        getBuildByName.mockReset();
        await resolveBuild(config);
        expect(getBuildByName).toHaveBeenCalledWith(220);
    });
    it('should return the right build', async () => {
        getBuildByName.mockReset();
        getBuildByName.mockReturnValue(
            Promise.resolve({
                sfid: 'qwerty1234'
            })
        );
        const build = await resolveBuild(config);
        expect(build).toBe('qwerty1234');
    });
    it('should return null when the build from database does not exists', async () => {
        getBuildByName.mockReset();
        getBuildByName.mockReturnValue(Promise.resolve(null));
        const build = await resolveBuild(config);
        expect(build).toBeNull();
    });
});
