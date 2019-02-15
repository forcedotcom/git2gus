const resolveBuild = require('../resolveBuild');
const getBuildByName = require('../getBuildByName');

jest.mock('../getBuildByName', () => jest.fn());
const config = {
    defaultBuild: 220,
};

describe('resolveBuild builds service', () => {
    it('should call getBuildByName with the right value when a milsetone is passed', () => {
        const milestone = {
            title: 218,
        };
        resolveBuild(config, milestone);
        expect(getBuildByName).toHaveBeenCalledWith(218);
    });
    it('should call getBuildByName with the right value when a milsetone is not passed', () => {
        getBuildByName.mockReset();
        resolveBuild(config);
        expect(getBuildByName).toHaveBeenCalledWith(220);
    });
    it('should return the right build', async () => {
        getBuildByName.mockReset();
        getBuildByName.mockReturnValue(Promise.resolve({
            sfid: 'qwerty1234',
        }));
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
